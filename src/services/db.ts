const DB_NAME = 'InventoryManagementSystem';
const DB_VERSION = 1;

export class IndexedDBService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        productStore.createIndex('name', 'name', { unique: true });
        productStore.createIndex('category', 'category');
        productStore.createIndex('supplier', 'supplier');

        db.createObjectStore('inventory', { keyPath: 'productId' });

        const salesStore = db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
        salesStore.createIndex('date', 'date');

        const supplierStore = db.createObjectStore('suppliers', { keyPath: 'id', autoIncrement: true });
        supplierStore.createIndex('name', 'name', { unique: true });

        const categoryStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        categoryStore.createIndex('name', 'name', { unique: true });

        const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        userStore.createIndex('username', 'username', { unique: true });
      };
    });
  }

  async add<T>(storeName: string, item: T): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as number);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T[]);
    });
  }

  async getById<T>(storeName: string, id: number): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T | undefined);
    });
  }

  async update<T>(storeName: string, item: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete(storeName: string, id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const dbService = new IndexedDBService();