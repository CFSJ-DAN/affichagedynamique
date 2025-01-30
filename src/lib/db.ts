// Création et gestion de la base de données IndexedDB
const DB_NAME = 'digital-signage';
const DB_VERSION = 1;
const MEDIA_STORE = 'media-content';

let dbInstance: IDBDatabase | null = null;

export const openDB = async (): Promise<IDBDatabase> => {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open database:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        const store = db.createObjectStore(MEDIA_STORE);
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onblocked = () => {
      console.error('Database blocked. Please close other tabs with this site open');
      reject(new Error('Database blocked'));
    };
  });
};

export const saveMediaContent = async (key: string, content: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE, 'readwrite');
      const store = transaction.objectStore(MEDIA_STORE);

      const data = {
        content,
        timestamp: Date.now()
      };

      const request = store.put(data, key);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => {
        console.error('Transaction failed:', transaction.error);
        reject(transaction.error);
      };

      request.onerror = () => {
        console.error('Failed to save media content:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to save media content:', error);
    throw error;
  }
};

export const getMediaContent = async (key: string): Promise<string | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE, 'readonly');
      const store = transaction.objectStore(MEDIA_STORE);
      const request = store.get(key);

      request.onsuccess = () => {
        const data = request.result;
        resolve(data ? data.content : null);
      };

      request.onerror = () => {
        console.error('Failed to get media content:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to get media content:', error);
    return null;
  }
};

export const deleteMediaContent = async (key: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE, 'readwrite');
      const store = transaction.objectStore(MEDIA_STORE);
      const request = store.delete(key);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => {
        console.error('Transaction failed:', transaction.error);
        reject(transaction.error);
      };

      request.onerror = () => {
        console.error('Failed to delete media content:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to delete media content:', error);
    throw error;
  }
};

// Initialiser la base de données au démarrage
openDB().catch(error => {
  console.error('Failed to initialize database:', error);
});