import React, { useState } from 'react';
import { Type, Plus, Trash2, Save, ChevronDown, ChevronUp, Image } from 'lucide-react';
import type { Template, TextElement } from '../../types/template';
import type { MediaItem } from '../../types/media';
import { useMediaStore } from '../../stores/mediaStore';
import { useTemplateStore } from '../../stores/templateStore';
import Modal from '../common/Modal';

interface TemplateEditorProps {
  template: Template;
  onUpdateTextElement: (elementId: string, data: Partial<TextElement>) => void;
  onAddTextElement: (element: Omit<TextElement, 'id'>) => void;
  onDeleteTextElement: (elementId: string) => void;
  onUpdateTemplate: (data: Partial<Template>) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onUpdateTextElement,
  onAddTextElement,
  onDeleteTextElement,
  onUpdateTemplate,
}) => {
  const { items: mediaItems } = useMediaStore();
  const { updateTemplate } = useTemplateStore();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [expandedElement, setExpandedElement] = useState<string | null>(null);
  const [localTemplate, setLocalTemplate] = useState<Template>(template);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [tempInputs, setTempInputs] = useState<Record<string, string>>({});
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);

  const scale = Math.min(
    400 / template.width,
    300 / template.height
  );

  const handleAddText = async () => {
    const newElement = {
      content: 'Nouveau texte',
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#000000',
      fontWeight: 'normal' as const,
      fontFamily: 'Arial',
    };
    
    const newId = crypto.randomUUID();
    const newTextElement = { ...newElement, id: newId };
    
    // Mettre à jour le template local
    const updatedTemplate = {
      ...localTemplate,
      textElements: [...localTemplate.textElements, newTextElement],
    };
    
    setLocalTemplate(updatedTemplate);
    
    // Sauvegarder immédiatement dans le store
    await updateTemplate(template.id, updatedTemplate);
    
    onAddTextElement(newElement);
    setUnsavedChanges(true);
    setExpandedElement(newId);
  };

  const handleUpdateElement = async (elementId: string, data: Partial<TextElement>) => {
    const updatedTemplate = {
      ...localTemplate,
      textElements: localTemplate.textElements.map(el =>
        el.id === elementId ? { ...el, ...data } : el
      ),
    };
    
    setLocalTemplate(updatedTemplate);
    
    // Sauvegarder immédiatement dans le store
    await updateTemplate(template.id, updatedTemplate);
    
    onUpdateTextElement(elementId, data);
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateTemplate(template.id, localTemplate);
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleNumberInput = (
    elementId: string,
    field: keyof TextElement,
    value: string,
    min: number,
    max: number
  ) => {
    const inputKey = `${elementId}-${field}`;
    setTempInputs(prev => ({
      ...prev,
      [inputKey]: value
    }));

    if (value === '') return;

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      handleUpdateElement(elementId, { [field]: clampedValue });
    }
  };

  const getInputValue = (elementId: string, field: keyof TextElement, actualValue: number) => {
    const inputKey = `${elementId}-${field}`;
    return inputKey in tempInputs ? tempInputs[inputKey] : actualValue.toString();
  };

  const handleInputBlur = (elementId: string, field: keyof TextElement, min: number, max: number) => {
    const inputKey = `${elementId}-${field}`;
    const value = tempInputs[inputKey];
    
    if (value === undefined || value === '') {
      const element = localTemplate.textElements.find(el => el.id === elementId);
      if (element) {
        setTempInputs(prev => ({ ...prev, [inputKey]: element[field].toString() }));
      }
      return;
    }

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      handleUpdateElement(elementId, { [field]: clampedValue });
      setTempInputs(prev => ({ ...prev, [inputKey]: clampedValue.toString() }));
    }
  };

  const handleBackgroundChange = (media: MediaItem) => {
    const newTemplate = {
      ...localTemplate,
      backgroundUrl: media.url,
    };
    setLocalTemplate(newTemplate);
    onUpdateTemplate({ backgroundUrl: media.url });
    setIsBackgroundModalOpen(false);
    setUnsavedChanges(true);
  };

  const fonts = [
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Courier New',
  ];

  const toggleElement = (elementId: string) => {
    setExpandedElement(expandedElement === elementId ? null : elementId);
  };

  // Filtrer uniquement les images
  const availableImages = mediaItems.filter(item => item.type === 'image');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={handleAddText}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Ajouter du texte
          </button>
          <button
            onClick={() => setIsBackgroundModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Image size={20} className="mr-2" />
            Changer l'image de fond
          </button>
        </div>

        {unsavedChanges && (
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Save size={20} className="mr-2" />
            Sauvegarder
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Zone de prévisualisation */}
        <div className="bg-gray-100 p-6 rounded-lg flex-shrink-0">
          <div className="mx-auto" style={{ width: template.width * scale }}>
            <div
              className="relative bg-white"
              style={{
                width: template.width,
                height: template.height,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <img
                src={localTemplate.backgroundUrl}
                alt={template.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {localTemplate.textElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-pointer ${
                    selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    fontSize: `${element.fontSize}px`,
                    color: element.color,
                    fontWeight: element.fontWeight,
                    fontFamily: element.fontFamily,
                  }}
                  onClick={() => setSelectedElement(element.id)}
                >
                  {element.content}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panneau de contrôle */}
        <div className="flex-1 bg-white rounded-lg border p-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Éléments de texte</h3>
            {localTemplate.textElements.map((element) => (
              <div
                key={element.id}
                className={`rounded-lg border transition-colors ${
                  selectedElement === element.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                {/* En-tête de l'élément */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleElement(element.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Type size={16} className="text-gray-500" />
                    <div>
                      <span className="font-medium">{element.content}</span>
                      <div className="text-sm text-gray-500">
                        {element.fontSize}px • {element.fontFamily}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTextElement(element.id);
                        setSelectedElement(null);
                        setExpandedElement(null);
                        setUnsavedChanges(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                    {expandedElement === element.id ? (
                      <ChevronUp size={20} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Contenu détaillé (visible uniquement si développé) */}
                {expandedElement === element.id && (
                  <div className="p-4 border-t bg-white space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Contenu
                      </label>
                      <input
                        type="text"
                        value={element.content}
                        onChange={(e) =>
                          handleUpdateElement(element.id, { content: e.target.value })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Position X
                        </label>
                        <input
                          type="number"
                          value={getInputValue(element.id, 'x', element.x)}
                          onChange={(e) => handleNumberInput(
                            element.id,
                            'x',
                            e.target.value,
                            0,
                            template.width
                          )}
                          onBlur={() => handleInputBlur(element.id, 'x', 0, template.width)}
                          min="0"
                          max={template.width}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Position Y
                        </label>
                        <input
                          type="number"
                          value={getInputValue(element.id, 'y', element.y)}
                          onChange={(e) => handleNumberInput(
                            element.id,
                            'y',
                            e.target.value,
                            0,
                            template.height
                          )}
                          onBlur={() => handleInputBlur(element.id, 'y', 0, template.height)}
                          min="0"
                          max={template.height}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Police
                      </label>
                      <select
                        value={element.fontFamily}
                        onChange={(e) =>
                          handleUpdateElement(element.id, { fontFamily: e.target.value })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {fonts.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Taille de police
                      </label>
                      <input
                        type="number"
                        value={getInputValue(element.id, 'fontSize', element.fontSize)}
                        onChange={(e) => handleNumberInput(
                          element.id,
                          'fontSize',
                          e.target.value,
                          8,
                          200
                        )}
                        onBlur={() => handleInputBlur(element.id, 'fontSize', 8, 200)}
                        min="8"
                        max="200"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Couleur
                      </label>
                      <input
                        type="color"
                        value={element.color}
                        onChange={(e) =>
                          handleUpdateElement(element.id, { color: e.target.value })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Style
                      </label>
                      <select
                        value={element.fontWeight}
                        onChange={(e) =>
                          handleUpdateElement(element.id, {
                            fontWeight: e.target.value as 'normal' | 'bold',
                          })
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Gras</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de sélection d'image de fond */}
      <Modal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
        title="Changer l'image de fond"
      >
        <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
          {availableImages.map((media) => (
            <div
              key={media.id}
              onClick={() => handleBackgroundChange(media)}
              className={`cursor-pointer rounded-lg border overflow-hidden hover:border-blue-500 transition-colors ${
                localTemplate.backgroundUrl === media.url ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="aspect-video relative">
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-sm font-medium truncate">{media.name}</p>
              </div>
            </div>
          ))}
          {availableImages.length === 0 && (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Aucune image disponible dans la médiathèque
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TemplateEditor;