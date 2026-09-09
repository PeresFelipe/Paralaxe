import type { OfflineGameSave } from '@greywake/domain'

export interface OfflineSaveRepository {
  list(): Promise<OfflineGameSave[]>
  get(saveId: string): Promise<OfflineGameSave | null>
  put(save: OfflineGameSave): Promise<void>
}
