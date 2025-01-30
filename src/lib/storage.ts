import LZString from 'lz-string';

// Storage wrapper with IndexedDB implementation
const MEDIA_STORE = 'media-content';
const DB_NAME = 'digital-signage';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE);
      }
    };
  });
};

const storage = {
  get: <T>(key: string): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      openDB().then(db => {
        const transaction = db.transaction([MEDIA_STORE], 'readonly');
        const store = transaction.objectStore(MEDIA_STORE);
        const request = store.get(key);

        request.onsuccess = () => {
          if (!request.result) {
            resolve(null);
            return;
          }
          try {
            const decompressed = LZString.decompress(request.result);
            resolve(decompressed ? JSON.parse(decompressed) : null);
          } catch {
            resolve(null);
          }
        };

        request.onerror = () => {
          console.error('Failed to get from storage:', request.error);
          reject(request.error);
        };
      }).catch(reject);
    });
  },
  
  set: <T>(key: string, value: T): Promise<void> => {
    return new Promise((resolve, reject) => {
      openDB().then(db => {
        const transaction = db.transaction([MEDIA_STORE], 'readwrite');
        const store = transaction.objectStore(MEDIA_STORE);
        const compressed = LZString.compress(JSON.stringify(value));
        const request = store.put(compressed, key);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error('Failed to save to storage:', request.error);
          reject(request.error);
        };
      }).catch(reject);
    });
  },
  
  remove: (key: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      openDB().then(db => {
        const transaction = db.transaction([MEDIA_STORE], 'readwrite');
        const store = transaction.objectStore(MEDIA_STORE);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error('Failed to remove from storage:', request.error);
          reject(request.error);
        };
      }).catch(reject);
    });
  },

  // Media content specific methods
  getMedia: async (id: string): Promise<string | null> => {
    try {
      const key = `media_${id}`;
      const result = await storage.get<string>(key);
      return result;
    } catch {
      return null;
    }
  },

  storeMedia: async (id: string, content: string): Promise<void> => {
    try {
      const key = `media_${id}`;
      await storage.set(key, content);
    } catch (error) {
      console.error('Failed to store media:', error);
      throw error;
    }
  },

  removeMedia: async (id: string): Promise<void> => {
    try {
      const key = `media_${id}`;
      await storage.remove(key);
    } catch (error) {
      console.error('Failed to remove media:', error);
      throw error;
    }
  }
};

export default storage;