import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useTemplateStore } from '../stores/templateStore';
import TemplateForm from '../components/templates/TemplateForm';
import TemplateEditor from '../components/templates/TemplateEditor';
import Modal from '../components/common/Modal';
import type { Template } from '../types/template';

const Templates: React.FC = () => {
  const {
    templates,
    addTemplate,
    deleteTemplate,
    updateTemplate,
    addTextElement,
    updateTextElement,
    deleteTextElement,
    loadTemplates
  } = useTemplateStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSubmit = async (data: any) => {
    try {
      if (selectedTemplate) {
        // Mise à jour d'un modèle existant
        await updateTemplate(selectedTemplate.id, data);
      } else {
        // Création d'un nouveau modèle
        const newTemplate = {
          ...data,
          textElements: [],
        };
        await addTemplate(newTemplate);
      }
      setIsModalOpen(false);
      setSelectedTemplate(null);
      // Recharger la liste des modèles
      await loadTemplates();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du modèle:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      try {
        await deleteTemplate(id);
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null);
        }
        // Recharger la liste des modèles
        await loadTemplates();
      } catch (error) {
        console.error('Erreur lors de la suppression du modèle:', error);
      }
    }
  };

  // Calculer l'échelle pour la miniature
  const calculateScale = (template: Template) => {
    const containerWidth = 400; // Largeur approximative de la carte
    const containerHeight = 225; // Hauteur approximative (16:9)
    return Math.min(
      containerWidth / template.width,
      containerHeight / template.height
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          {selectedTemplate ? (
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Retour aux modèles
            </button>
          ) : (
            <h1 className="text-3xl font-bold text-gray-800">Modèles</h1>
          )}
        </div>
        {!selectedTemplate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Nouveau modèle
          </button>
        )}
      </div>

      {selectedTemplate ? (
        <TemplateEditor
          template={selectedTemplate}
          onUpdateTextElement={async (elementId, data) => {
            await updateTextElement(selectedTemplate.id, elementId, data);
            const updatedTemplate = {
              ...selectedTemplate,
              textElements: selectedTemplate.textElements.map(el =>
                el.id === elementId ? { ...el, ...data } : el
              ),
            };
            setSelectedTemplate(updatedTemplate);
          }}
          onAddTextElement={async (element) => {
            const newElement = { ...element, id: crypto.randomUUID() };
            await addTextElement(selectedTemplate.id, element);
            const updatedTemplate = {
              ...selectedTemplate,
              textElements: [...selectedTemplate.textElements, newElement],
            };
            setSelectedTemplate(updatedTemplate);
          }}
          onDeleteTextElement={async (elementId) => {
            await deleteTextElement(selectedTemplate.id, elementId);
            const updatedTemplate = {
              ...selectedTemplate,
              textElements: selectedTemplate.textElements.filter(el => el.id !== elementId),
            };
            setSelectedTemplate(updatedTemplate);
          }}
          onUpdateTemplate={async (data) => {
            await updateTemplate(selectedTemplate.id, data);
            setSelectedTemplate(prev => prev ? { ...prev, ...data } : null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(templates || []).map((template) => {
            const scale = calculateScale(template);
            
            return (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div 
                  className="aspect-video relative cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      style={{
                        width: template.width * scale,
                        height: template.height * scale,
                        position: 'relative',
                      }}
                    >
                      <img
                        src={template.backgroundUrl}
                        alt={template.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {template.textElements.map((element) => (
                        <div
                          key={element.id}
                          className="absolute pointer-events-none whitespace-nowrap"
                          style={{
                            left: `${element.x * scale}px`,
                            top: `${element.y * scale}px`,
                            fontSize: `${element.fontSize * scale}px`,
                            color: element.color,
                            fontWeight: element.fontWeight,
                            fontFamily: element.fontFamily,
                            transform: 'scale(1)',
                            transformOrigin: 'top left',
                          }}
                        >
                          {element.content}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template);
                        }}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(template.id);
                        }}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTemplate(null);
        }}
        title={selectedTemplate ? 'Modifier le modèle' : 'Nouveau modèle'}
      >
        <TemplateForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTemplate(null);
          }}
          initialData={selectedTemplate || undefined}
        />
      </Modal>
    </div>
  );
};

export default Templates;