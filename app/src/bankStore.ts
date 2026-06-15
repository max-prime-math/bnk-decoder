export interface BankCurriculumMetadata {
  className?: string;
  unitName?: string;
  sectionName?: string;
}

export interface StoredBankRecord {
  id: string;
  filename: string;
  uploadedAt: number;
  size: number;
  bytes: ArrayBuffer;
  curriculum?: BankCurriculumMetadata;
}

const DB_NAME = 'bnk-decoder-store';
const DB_VERSION = 1;
const STORE_NAME = 'banks';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('uploadedAt', 'uploadedAt');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open bank database.'));
  });

  return dbPromise;
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => Promise<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    run(store).then(resolve, reject);
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed.'));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

export async function listStoredBanks(): Promise<Omit<StoredBankRecord, 'bytes'>[]> {
  return withStore('readonly', async (store) => {
    const rows = await requestToPromise(store.getAll());
    return rows
      .map((row) => ({
        id: row.id,
        filename: row.filename,
        uploadedAt: row.uploadedAt,
        size: row.size,
        curriculum: row.curriculum,
      }))
      .sort((left, right) => right.uploadedAt - left.uploadedAt || left.filename.localeCompare(right.filename));
  });
}

export async function getStoredBank(id: string): Promise<StoredBankRecord | undefined> {
  return withStore('readonly', (store) => requestToPromise(store.get(id)));
}

export async function putStoredBank(record: StoredBankRecord): Promise<void> {
  return withStore('readwrite', async (store) => {
    await requestToPromise(store.put(record));
  });
}

export async function deleteStoredBank(id: string): Promise<void> {
  return withStore('readwrite', async (store) => {
    await requestToPromise(store.delete(id));
  });
}
