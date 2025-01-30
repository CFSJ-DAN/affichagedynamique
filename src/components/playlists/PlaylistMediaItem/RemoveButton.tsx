import React from 'react';

interface RemoveButtonProps {
  onRemove: () => void;
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({ onRemove }) => (
  <button
    onClick={onRemove}
    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
    title="Supprimer"
  >
    ×
  </button>
);