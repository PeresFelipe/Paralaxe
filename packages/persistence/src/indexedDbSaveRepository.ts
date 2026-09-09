import type { OfflineGameSave } from '@greywake/domain'
import type { OfflineSaveRepository } from './saveRepository'

const DATABASE_NAME = 'greywake'
const DATABASE_VERSION = 1
const SAVE_STORE = 'saves'

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result), { once: true })
    request.addEventListener(
      'error',
      () => reject(request.error ?? new Error('Falha em uma operação do IndexedDB.')),
      { once: true },
    )
  })
}

function transactionToPromise(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.addEventListener('complete', () => resolve(), { once: true })
    transaction.addEventListener(
      'error',
      () => reject(transaction.error ?? new Error('Falha na transação do IndexedDB.')),
      { once: true },
    )
    transaction.addEventListener(
      'abort',
      () => reject(transaction.error ?? new Error('Transação do IndexedDB abortada.')),
      { once: true },
    )
  })
}

function openDatabase() {
  if (!globalThis.indexedDB) {
    return Promise.reject(new Error('IndexedDB não está disponível neste navegador.'))
  }

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = globalThis.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.addEventListener(
      'upgradeneeded',
      () => {
        const database = request.result

        if (!database.objectStoreNames.contains(SAVE_STORE)) {
          database.createObjectStore(SAVE_STORE, { keyPath: 'saveId' })
        }
      },
      { once: true },
    )

    request.addEventListener('success', () => resolve(request.result), { once: true })
    request.addEventListener(
      'error',
      () => reject(request.error ?? new Error('Não foi possível abrir o banco local.')),
      { once: true },
    )
  })
}

export function createIndexedDbSaveRepository(): OfflineSaveRepository {
  return {
    async list() {
      const database = await openDatabase()

      try {
        const transaction = database.transaction(SAVE_STORE, 'readonly')
        const done = transactionToPromise(transaction)
        const request = transaction.objectStore(SAVE_STORE).getAll()
        const saves = (await requestToPromise(request)) as OfflineGameSave[]
        await done

        return saves.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      } finally {
        database.close()
      }
    },

    async get(saveId) {
      const database = await openDatabase()

      try {
        const transaction = database.transaction(SAVE_STORE, 'readonly')
        const done = transactionToPromise(transaction)
        const request = transaction.objectStore(SAVE_STORE).get(saveId)
        const save = (await requestToPromise(request)) as OfflineGameSave | undefined
        await done

        return save ?? null
      } finally {
        database.close()
      }
    },

    async put(save) {
      const database = await openDatabase()

      try {
        const transaction = database.transaction(SAVE_STORE, 'readwrite')
        const done = transactionToPromise(transaction)
        const request = transaction.objectStore(SAVE_STORE).put(save)
        await requestToPromise(request)
        await done
      } finally {
        database.close()
      }
    },
  }
}
