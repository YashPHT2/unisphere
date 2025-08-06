import { useState, useEffect } from 'react';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}

export const useMediaLibrary = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cms-media');
    if (stored) {
      setMediaItems(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (items: MediaItem[]) => {
    localStorage.setItem('cms-media', JSON.stringify(items));
    setMediaItems(items);
  };

  const addMediaItem = (file: File): Promise<MediaItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newItem: MediaItem = {
          id: Date.now().toString(),
          name: file.name,
          url: reader.result as string,
          size: file.size,
          type: file.type,
          createdAt: new Date().toISOString(),
        };
        
        const updated = [...mediaItems, newItem];
        saveToStorage(updated);
        resolve(newItem);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const removeMediaItem = (id: string) => {
    const updated = mediaItems.filter(item => item.id !== id);
    saveToStorage(updated);
  };

  const getMediaItem = (id: string) => {
    return mediaItems.find(item => item.id === id);
  };

  return {
    mediaItems,
    addMediaItem,
    removeMediaItem,
    getMediaItem,
  };
};