import { StudentRecord } from '@/types';
import { SPREADSHEET_NAME, SHEET_HEADERS } from '@/constants';
import { googleAuthService } from '@/services/auth/GoogleAuthService';

interface SheetRange {
  range: string;
  majorDimension: 'ROWS' | 'COLUMNS';
  values: any[][];
}

interface SpreadsheetInfo {
  spreadsheetId: string;
  title: string;
  sheets: { properties: { title: string; sheetId: number } }[];
}

export interface RecordMatch {
  rowIndex: number;
  record: StudentRecord;
}

class GoogleSheetsService {
  private baseURL = 'https://sheets.googleapis.com/v4/spreadsheets';
  private driveURL = 'https://www.googleapis.com/drive/v3/files';

  private async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const accessToken = await googleAuthService.refreshAccessToken();
    
    if (!accessToken) {
      throw new Error('No valid access token available');
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return response;
  }

  async findOrCreateSpreadsheet(): Promise<string> {
    try {
      // Search for existing BPApp spreadsheet
      const searchURL = `${this.driveURL}?q=name='${SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet'`;
      const searchResponse = await this.makeAuthenticatedRequest(searchURL);
      const searchData = await searchResponse.json();

      if (searchData.files && searchData.files.length > 0) {
        // Spreadsheet exists
        const spreadsheetId = searchData.files[0].id;
        await this.ensureHeadersExist(spreadsheetId);
        return spreadsheetId;
      }

      // Create new spreadsheet
      return await this.createSpreadsheet();
    } catch (error) {
      console.error('Error finding/creating spreadsheet:', error);
      throw new Error('Failed to access or create spreadsheet');
    }
  }

  private async createSpreadsheet(): Promise<string> {
    const createURL = `${this.baseURL}`;
    
    const spreadsheetData = {
      properties: {
        title: SPREADSHEET_NAME,
        locale: 'he_IL',
      },
      sheets: [{
        properties: {
          title: 'נתונים',
          gridProperties: {
            rowCount: 1000,
            columnCount: 12,
          },
        },
      }],
    };

    const response = await this.makeAuthenticatedRequest(createURL, {
      method: 'POST',
      body: JSON.stringify(spreadsheetData),
    });

    const newSpreadsheet = await response.json();
    const spreadsheetId = newSpreadsheet.spreadsheetId;

    // Add headers
    await this.setHeaders(spreadsheetId);
    
    return spreadsheetId;
  }

  private async ensureHeadersExist(spreadsheetId: string): Promise<void> {
    try {
      const data = await this.getSheetData(spreadsheetId, 'נתונים!A1:L1');
      
      if (!data.values || data.values.length === 0 || data.values[0].length === 0) {
        await this.setHeaders(spreadsheetId);
      }
    } catch (error) {
      // If sheet doesn't exist or error occurred, set headers
      await this.setHeaders(spreadsheetId);
    }
  }

  private async setHeaders(spreadsheetId: string): Promise<void> {
    const headerData = {
      range: 'נתונים!A1:L1',
      majorDimension: 'ROWS',
      values: [SHEET_HEADERS],
    };

    const updateURL = `${this.baseURL}/${spreadsheetId}/values/נתונים!A1:L1?valueInputOption=RAW`;
    
    await this.makeAuthenticatedRequest(updateURL, {
      method: 'PUT',
      body: JSON.stringify(headerData),
    });
  }

  async getSheetData(spreadsheetId: string, range: string): Promise<SheetRange> {
    const getURL = `${this.baseURL}/${spreadsheetId}/values/${range}`;
    const response = await this.makeAuthenticatedRequest(getURL);
    return await response.json();
  }

  async getAllRecords(spreadsheetId: string): Promise<StudentRecord[]> {
    try {
      const data = await this.getSheetData(spreadsheetId, 'נתונים!A2:L1000');
      
      if (!data.values || data.values.length === 0) {
        return [];
      }

      return data.values.map((row, index) => ({
        תאריך: row[0] || '',
        שם_התלמיד: row[1] || '',
        שם_הכיתה: row[2] || '',
        מספר_השיעור: parseInt(row[3]) || 1,
        כניסה: parseInt(row[4]) || 0,
        שהייה: parseInt(row[5]) || 0,
        אווירה: parseInt(row[6]) || 0,
        ביצוע: parseInt(row[7]) || 0,
        מטרה_אישית: parseInt(row[8]) || 0,
        בונוס: parseInt(row[9]) || 0,
        סהכ: parseInt(row[10]) || 0,
        הערות: row[11] || '',
      }));
    } catch (error) {
      console.error('Error getting records:', error);
      return [];
    }
  }

  async findMatchingRecord(
    spreadsheetId: string,
    תאריך: string,
    שם_התלמיד: string,
    שם_הכיתה: string,
    מספר_השיעור: number
  ): Promise<RecordMatch | null> {
    try {
      const records = await this.getAllRecords(spreadsheetId);
      
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        
        // 4-field exact match logic
        if (
          record.תאריך === תאריך &&
          record.שם_התלמיד === שם_התלמיד &&
          record.שם_הכיתה === שם_הכיתה &&
          record.מספר_השיעור === מספר_השיעור
        ) {
          return {
            rowIndex: i + 2, // +2 because row 1 is headers and array is 0-indexed
            record,
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error finding matching record:', error);
      return null;
    }
  }

  async createRecord(spreadsheetId: string, record: StudentRecord): Promise<void> {
    try {
      // Find next empty row
      const records = await this.getAllRecords(spreadsheetId);
      const nextRow = records.length + 2; // +2 for header row and 1-based indexing

      const rowData = [
        record.תאריך,
        record.שם_התלמיד,
        record.שם_הכיתה,
        record.מספר_השיעור,
        record.כניסה,
        record.שהייה,
        record.אווירה,
        record.ביצוע,
        record.מטרה_אישית,
        record.בונוס,
        record.סהכ,
        record.הערות,
      ];

      const updateData = {
        range: `נתונים!A${nextRow}:L${nextRow}`,
        majorDimension: 'ROWS',
        values: [rowData],
      };

      const updateURL = `${this.baseURL}/${spreadsheetId}/values/נתונים!A${nextRow}:L${nextRow}?valueInputOption=RAW`;
      
      await this.makeAuthenticatedRequest(updateURL, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      console.error('Error creating record:', error);
      throw new Error('Failed to create record');
    }
  }

  async updateRecord(spreadsheetId: string, rowIndex: number, record: StudentRecord): Promise<void> {
    try {
      const rowData = [
        record.תאריך,
        record.שם_התלמיד,
        record.שם_הכיתה,
        record.מספר_השיעור,
        record.כניסה,
        record.שהייה,
        record.אווירה,
        record.ביצוע,
        record.מטרה_אישית,
        record.בונוס,
        record.סהכ,
        record.הערות,
      ];

      const updateData = {
        range: `נתונים!A${rowIndex}:L${rowIndex}`,
        majorDimension: 'ROWS',
        values: [rowData],
      };

      const updateURL = `${this.baseURL}/${spreadsheetId}/values/נתונים!A${rowIndex}:L${rowIndex}?valueInputOption=RAW`;
      
      await this.makeAuthenticatedRequest(updateURL, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      console.error('Error updating record:', error);
      throw new Error('Failed to update record');
    }
  }

  async getUniqueStudentNames(spreadsheetId: string): Promise<string[]> {
    try {
      const data = await this.getSheetData(spreadsheetId, 'נתונים!B2:B1000');
      
      if (!data.values) return [];
      
      const names = data.values
        .map(row => row[0])
        .filter(name => name && name.trim() !== '')
        .filter((name, index, arr) => arr.indexOf(name) === index); // unique values
      
      return names;
    } catch (error) {
      console.error('Error getting student names:', error);
      return [];
    }
  }

  async getUniqueClassNames(spreadsheetId: string): Promise<string[]> {
    try {
      const data = await this.getSheetData(spreadsheetId, 'נתונים!C2:C1000');
      
      if (!data.values) return [];
      
      const classes = data.values
        .map(row => row[0])
        .filter(className => className && className.trim() !== '')
        .filter((className, index, arr) => arr.indexOf(className) === index); // unique values
      
      return classes;
    } catch (error) {
      console.error('Error getting class names:', error);
      return [];
    }
  }

  async getNextClassNumber(spreadsheetId: string, date: string): Promise<number> {
    try {
      const records = await this.getAllRecords(spreadsheetId);
      
      const todayRecords = records.filter(record => record.תאריך === date);
      
      if (todayRecords.length === 0) return 1;
      
      const usedNumbers = todayRecords.map(record => record.מספר_השיעור);
      const maxNumber = Math.max(...usedNumbers);
      
      // Find first available number or next sequential
      for (let i = 1; i <= 7; i++) {
        if (!usedNumbers.includes(i)) {
          return i;
        }
      }
      
      return Math.min(maxNumber + 1, 7);
    } catch (error) {
      console.error('Error getting next class number:', error);
      return 1;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();