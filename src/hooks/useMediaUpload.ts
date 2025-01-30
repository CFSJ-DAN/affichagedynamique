import { useState, useCallback } from 'react';
import type { MediaItem } from '../types/media';

interface UseMediaUploadOptions {
  onSuccess?: (media: MediaItem) => void;
  onError?: (error: Error) => void;
}

export const useMediaUpload = ({ onSuccess, onError }: UseMediaUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadMedia = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Convertir le fichier en base64 pour un stockage persistant
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const media: MediaItem = {
        id: crypto.randomUUID(),
        name: file.name.split('.')[0],
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: base64,
        duration: 10,
        tags: [],
        createdAt: new Date().toISOString(),
      };

      onSuccess?.(media);
      return media;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [onSuccess, onError]);

  return {
    uploadMedia,
    isUploading,
    error,
  };
};