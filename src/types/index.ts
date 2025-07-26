export interface StudentRecord {
  תאריך: string; // Date
  שם_התלמיד: string; // Student Name
  שם_הכיתה: string; // Class Name
  מספר_השיעור: number; // Class Number (1-7)
  כניסה: number; // Entry On Time (0-1)
  שהייה: number; // Staying in Class (0-3)
  אווירה: number; // Attitude (0-2)
  ביצוע: number; // Performance (0-2)
  מטרה_אישית: number; // Personal Goal (0-2)
  בונוס: number; // Bonus (0-1)
  הערות: string; // Comments
  סהכ?: number; // Total Score (calculated)
}

export interface FormData extends StudentRecord {}

export interface AutocompleteItem {
  id: string;
  label: string;
  value: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId?: string;
  range: string;
  valueInputOption: 'RAW' | 'USER_ENTERED';
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export type NumberPickerField = 'מספר_השיעור' | 'כניסה' | 'שהייה' | 'אווירה' | 'ביצוע' | 'מטרה_אישית' | 'בונוס';
export type TextFieldName = 'שם_התלמיד' | 'שם_הכיתה' | 'הערות';
export type DateFieldName = 'תאריך';