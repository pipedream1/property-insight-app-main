
interface OfflinePhoto {
  id: string;
  blob: Blob;
  metadata: {
    timestamp: Date;
    componentType?: string;
    componentName?: string;
    inspectionId?: string;
  };
  retryCount: number;
  createdAt: Date;
}

class OfflineStorageManager {
  private dbName = 'PropertyInspectionOffline';
  private version = 1;
  private storeName = 'photos';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async storePhoto(photo: Omit<OfflinePhoto, 'id' | 'retryCount' | 'createdAt'>): Promise<string> {
    if (!this.db) await this.init();

    const photoWithId: OfflinePhoto = {
      ...photo,
      id: crypto.randomUUID(),
      retryCount: 0,
      createdAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(photoWithId);

      request.onsuccess = () => resolve(photoWithId.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPhotos(): Promise<OfflinePhoto[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removePhoto(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateRetryCount(id: string, retryCount: number): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const photo = getRequest.result;
        if (photo) {
          photo.retryCount = retryCount;
          const updateRequest = store.put(photo);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Photo not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
}

export const offlineStorage = new OfflineStorageManager();
