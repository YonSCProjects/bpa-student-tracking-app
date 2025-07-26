import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudentRecord, AutocompleteItem } from '@/types';

const KEYS = {
  PENDING_RECORDS: 'pending_records',
  CACHED_STUDENTS: 'cached_students',
  CACHED_CLASSES: 'cached_classes',
  LAST_SYNC: 'last_sync',
  SPREADSHEET_ID: 'spreadsheet_id',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
} as const;

export interface PendingRecord extends StudentRecord {
  id: string;
  timestamp: number;
  isUpdate: boolean;
  syncAttempts: number;
}

export interface CachedData {
  students: AutocompleteItem[];
  classes: AutocompleteItem[];
  lastUpdate: number;
}

export interface AppSettings {
  autoSync: boolean;
  offlineMode: boolean;
  maxSyncAttempts: number;
  cacheExpiry: number; // hours
}

class OfflineStorageService {
  private defaultSettings: AppSettings = {
    autoSync: true,
    offlineMode: false,
    maxSyncAttempts: 3,
    cacheExpiry: 24,
  };

  // Pending Records Management
  async addPendingRecord(record: StudentRecord, isUpdate: boolean = false): Promise<string> {
    try {
      const pendingRecords = await this.getPendingRecords();
      
      const pendingRecord: PendingRecord = {
        ...record,
        id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        isUpdate,
        syncAttempts: 0,
      };

      pendingRecords.push(pendingRecord);
      await AsyncStorage.setItem(KEYS.PENDING_RECORDS, JSON.stringify(pendingRecords));
      
      return pendingRecord.id;
    } catch (error) {
      console.error('Failed to add pending record:', error);
      throw new Error('Failed to save record offline');
    }
  }

  async getPendingRecords(): Promise<PendingRecord[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PENDING_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get pending records:', error);
      return [];
    }
  }

  async removePendingRecord(id: string): Promise<void> {
    try {
      const pendingRecords = await this.getPendingRecords();
      const updatedRecords = pendingRecords.filter(record => record.id !== id);
      await AsyncStorage.setItem(KEYS.PENDING_RECORDS, JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Failed to remove pending record:', error);
    }
  }

  async updatePendingRecordSyncAttempts(id: string): Promise<void> {
    try {
      const pendingRecords = await this.getPendingRecords();
      const recordIndex = pendingRecords.findIndex(record => record.id === id);
      
      if (recordIndex !== -1) {
        pendingRecords[recordIndex].syncAttempts += 1;
        await AsyncStorage.setItem(KEYS.PENDING_RECORDS, JSON.stringify(pendingRecords));
      }
    } catch (error) {
      console.error('Failed to update sync attempts:', error);
    }
  }

  async getPendingRecordCount(): Promise<number> {
    const pendingRecords = await this.getPendingRecords();
    return pendingRecords.length;
  }

  // Cache Management
  async cacheSuggestions(students: AutocompleteItem[], classes: AutocompleteItem[]): Promise<void> {
    try {
      const cacheData: CachedData = {
        students,
        classes,
        lastUpdate: Date.now(),
      };

      await AsyncStorage.setItem(KEYS.CACHED_STUDENTS, JSON.stringify(students));
      await AsyncStorage.setItem(KEYS.CACHED_CLASSES, JSON.stringify(classes));
      await AsyncStorage.setItem(KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('Failed to cache suggestions:', error);
    }
  }

  async getCachedStudents(): Promise<AutocompleteItem[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CACHED_STUDENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get cached students:', error);
      return [];
    }
  }

  async getCachedClasses(): Promise<AutocompleteItem[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CACHED_CLASSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get cached classes:', error);
      return [];
    }
  }

  async isCacheExpired(): Promise<boolean> {
    try {
      const lastSync = await AsyncStorage.getItem(KEYS.LAST_SYNC);
      if (!lastSync) return true;

      const settings = await this.getAppSettings();
      const expiryTime = settings.cacheExpiry * 60 * 60 * 1000; // Convert hours to milliseconds
      const timeSinceLastSync = Date.now() - parseInt(lastSync);

      return timeSinceLastSync > expiryTime;
    } catch (error) {
      console.error('Failed to check cache expiry:', error);
      return true;
    }
  }

  // App Settings
  async getAppSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.APP_SETTINGS);
      return data ? { ...this.defaultSettings, ...JSON.parse(data) } : this.defaultSettings;
    } catch (error) {
      console.error('Failed to get app settings:', error);
      return this.defaultSettings;
    }
  }

  async updateAppSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const currentSettings = await this.getAppSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to update app settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  // User Data
  async saveSpreadsheetId(id: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SPREADSHEET_ID, id);
    } catch (error) {
      console.error('Failed to save spreadsheet ID:', error);
    }
  }

  async getSpreadsheetId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.SPREADSHEET_ID);
    } catch (error) {
      console.error('Failed to get spreadsheet ID:', error);
      return null;
    }
  }

  async saveUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  async getUserData(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.PENDING_RECORDS,
        KEYS.CACHED_STUDENTS,
        KEYS.CACHED_CLASSES,
        KEYS.LAST_SYNC,
        KEYS.SPREADSHEET_ID,
        KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  async getStorageInfo(): Promise<{
    pendingRecords: number;
    cachedStudents: number;
    cachedClasses: number;
    cacheAge: number; // hours
  }> {
    try {
      const [pendingRecords, students, classes, lastSync] = await Promise.all([
        this.getPendingRecords(),
        this.getCachedStudents(),
        this.getCachedClasses(),
        AsyncStorage.getItem(KEYS.LAST_SYNC),
      ]);

      const cacheAge = lastSync 
        ? Math.floor((Date.now() - parseInt(lastSync)) / (1000 * 60 * 60))
        : 0;

      return {
        pendingRecords: pendingRecords.length,
        cachedStudents: students.length,
        cachedClasses: classes.length,
        cacheAge,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        pendingRecords: 0,
        cachedStudents: 0,
        cachedClasses: 0,
        cacheAge: 0,
      };
    }
  }
}

export const offlineStorageService = new OfflineStorageService();