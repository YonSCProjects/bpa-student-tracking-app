import NetInfo from '@react-native-community/netinfo';
import { googleSheetsService } from '@/services/googleSheets/GoogleSheetsService';
import { offlineStorageService, PendingRecord } from '@/services/storage/OfflineStorageService';
import { useAuthStore } from '@/store/authStore';

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

class SyncService {
  private isSyncing = false;
  private syncCallbacks: ((result: SyncResult) => void)[] = [];

  async isOnline(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected ?? false;
    } catch (error) {
      console.error('Failed to check network status:', error);
      return false;
    }
  }

  async syncPendingRecords(): Promise<SyncResult> {
    if (this.isSyncing) {
      throw new Error('Sync already in progress');
    }

    this.isSyncing = true;
    const result: SyncResult = {
      success: false,
      synced: 0,
      failed: 0,
      errors: [],
    };

    try {
      // Check if online
      if (!(await this.isOnline())) {
        throw new Error('No internet connection');
      }

      // Check authentication
      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

      // Get spreadsheet ID
      const spreadsheetId = await offlineStorageService.getSpreadsheetId();
      if (!spreadsheetId) {
        throw new Error('No spreadsheet ID available');
      }

      // Get pending records
      const pendingRecords = await offlineStorageService.getPendingRecords();
      const settings = await offlineStorageService.getAppSettings();

      for (const record of pendingRecords) {
        try {
          // Skip if max attempts reached
          if (record.syncAttempts >= settings.maxSyncAttempts) {
            result.failed++;
            result.errors.push(`Max sync attempts reached for record: ${record.שם_התלמיד}`);
            continue;
          }

          // Attempt to sync
          if (record.isUpdate) {
            // Find existing record and update
            const match = await googleSheetsService.findMatchingRecord(
              spreadsheetId,
              record.תאריך,
              record.שם_התלמיד,
              record.שם_הכיתה,
              record.מספר_השיעור
            );

            if (match) {
              await googleSheetsService.updateRecord(spreadsheetId, match.rowIndex, record);
            } else {
              // Record not found, create new
              await googleSheetsService.createRecord(spreadsheetId, record);
            }
          } else {
            await googleSheetsService.createRecord(spreadsheetId, record);
          }

          // Remove from pending records
          await offlineStorageService.removePendingRecord(record.id);
          result.synced++;
        } catch (error: any) {
          console.error(`Failed to sync record ${record.id}:`, error);
          
          // Update sync attempts
          await offlineStorageService.updatePendingRecordSyncAttempts(record.id);
          
          result.failed++;
          result.errors.push(`Failed to sync ${record.שם_התלמיד}: ${error.message}`);
        }
      }

      result.success = result.failed === 0;
      
      // Notify callbacks
      this.notifyCallbacks(result);
      
      return result;
    } catch (error: any) {
      console.error('Sync failed:', error);
      result.errors.push(error.message);
      this.notifyCallbacks(result);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  async syncInBackground(): Promise<void> {
    try {
      const settings = await offlineStorageService.getAppSettings();
      
      if (!settings.autoSync) return;
      
      const pendingCount = await offlineStorageService.getPendingRecordCount();
      if (pendingCount === 0) return;

      if (await this.isOnline()) {
        await this.syncPendingRecords();
      }
    } catch (error) {
      console.log('Background sync failed:', error);
      // Silent fail for background sync
    }
  }

  onSyncComplete(callback: (result: SyncResult) => void): () => void {
    this.syncCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.syncCallbacks.indexOf(callback);
      if (index > -1) {
        this.syncCallbacks.splice(index, 1);
      }
    };
  }

  private notifyCallbacks(result: SyncResult): void {
    this.syncCallbacks.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('Sync callback error:', error);
      }
    });
  }

  async forceSyncRecord(record: PendingRecord): Promise<boolean> {
    try {
      if (!(await this.isOnline())) {
        throw new Error('No internet connection');
      }

      const spreadsheetId = await offlineStorageService.getSpreadsheetId();
      if (!spreadsheetId) {
        throw new Error('No spreadsheet ID available');
      }

      if (record.isUpdate) {
        const match = await googleSheetsService.findMatchingRecord(
          spreadsheetId,
          record.תאריך,
          record.שם_התלמיד,
          record.שם_הכיתה,
          record.מספר_השיעור
        );

        if (match) {
          await googleSheetsService.updateRecord(spreadsheetId, match.rowIndex, record);
        } else {
          await googleSheetsService.createRecord(spreadsheetId, record);
        }
      } else {
        await googleSheetsService.createRecord(spreadsheetId, record);
      }

      await offlineStorageService.removePendingRecord(record.id);
      return true;
    } catch (error) {
      console.error('Force sync failed:', error);
      await offlineStorageService.updatePendingRecordSyncAttempts(record.id);
      return false;
    }
  }

  getIsSyncing(): boolean {
    return this.isSyncing;
  }

  async retryFailedSyncs(): Promise<SyncResult> {
    try {
      const pendingRecords = await offlineStorageService.getPendingRecords();
      const settings = await offlineStorageService.getAppSettings();
      
      // Reset sync attempts for records under max attempts
      for (const record of pendingRecords) {
        if (record.syncAttempts < settings.maxSyncAttempts) {
          record.syncAttempts = 0;
        }
      }

      return await this.syncPendingRecords();
    } catch (error: any) {
      throw new Error(`Retry failed: ${error.message}`);
    }
  }
}

export const syncService = new SyncService();