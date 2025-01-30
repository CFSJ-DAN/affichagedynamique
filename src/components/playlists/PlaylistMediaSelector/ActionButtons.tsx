import React from 'react';

interface ActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onConfirm,
}) => (
  <div className="flex justify-end space-x-3 pt-4 border-t">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
    >
      Annuler
    </button>
    <button
      type="button"
      onClick={onConfirm}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Confirmer la sélection
    </button>
  </div>
);