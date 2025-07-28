import { renderHook, act } from '@testing-library/react-native';
import { useGoogleSheets } from '../../src/hooks/useGoogleSheets';

// Mock the services and stores
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
  }),
}));

jest.mock('../../src/store/dataStore', () => ({
  useDataStore: () => ({
    spreadsheetId: 'test-sheet-id',
    studentSuggestions: [],
    classSuggestions: [],
    isLoadingData: false,
    isSaving: false,
    setSpreadsheetId: jest.fn(),
    setStudentSuggestions: jest.fn(),
    setClassSuggestions: jest.fn(),
    setLoadingData: jest.fn(),
    setSaving: jest.fn(),
  }),
}));

jest.mock('../../src/services', () => ({
  googleSheetsService: {
    findOrCreateSpreadsheet: jest.fn().mockResolvedValue('test-sheet-id'),
    findMatchingRecord: jest.fn(),
    createRecord: jest.fn(),
    updateRecord: jest.fn(),
    getUniqueStudentNames: jest.fn().mockResolvedValue(['דוד כהן', 'שרה לוי']),
    getUniqueClassNames: jest.fn().mockResolvedValue(['מתמטיקה א', 'עברית ב']),
    getNextClassNumber: jest.fn().mockResolvedValue(2),
  },
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('useGoogleSheets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes correctly', () => {
    const { result } = renderHook(() => useGoogleSheets());

    expect(result.current.spreadsheetId).toBe('test-sheet-id');
    expect(result.current.isLoadingData).toBe(false);
    expect(result.current.isSaving).toBe(false);
  });

  it('provides all required functions', () => {
    const { result } = renderHook(() => useGoogleSheets());

    expect(typeof result.current.initializeSpreadsheet).toBe('function');
    expect(typeof result.current.findMatchingRecord).toBe('function');
    expect(typeof result.current.saveRecord).toBe('function');
    expect(typeof result.current.getNextClassNumber).toBe('function');
    expect(typeof result.current.loadStudentSuggestions).toBe('function');
    expect(typeof result.current.loadClassSuggestions).toBe('function');
  });

  it('handles record matching correctly', async () => {
    const mockRecord = {
      תאריך: '2024-01-15',
      שם_התלמיד: 'דוד כהן',
      שם_הכיתה: 'מתמטיקה א',
      מספר_השיעור: 3,
      כניסה: 1,
      שהייה: 2,
      אווירה: 1,
      ביצוע: 2,
      מטרה_אישית: 1,
      בונוס: 0,
      סהכ: 7,
      הערות: 'טוב',
    };

    const { googleSheetsService } = require('../../src/services');
    googleSheetsService.findMatchingRecord.mockResolvedValue({
      rowIndex: 2,
      record: mockRecord,
    });

    const { result } = renderHook(() => useGoogleSheets());

    await act(async () => {
      const foundRecord = await result.current.findMatchingRecord(
        '2024-01-15',
        'דוד כהן',
        'מתמטיקה א',
        3
      );

      expect(foundRecord).toEqual(mockRecord);
    });
  });

  it('handles save operations correctly', async () => {
    const mockRecord = {
      תאריך: '2024-01-15',
      שם_התלמיד: 'דוד כהן',
      שם_הכיתה: 'מתמטיקה א',
      מספר_השיעור: 3,
      כניסה: 1,
      שהייה: 2,
      אווירה: 1,
      ביצוע: 2,
      מטרה_אישית: 1,
      בונוס: 0,
      סהכ: 7,
      הערות: 'טוב',
    };

    const { googleSheetsService } = require('../../src/services');
    const { result } = renderHook(() => useGoogleSheets());

    await act(async () => {
      const success = await result.current.saveRecord(mockRecord, false);
      expect(success).toBe(true);
      expect(googleSheetsService.createRecord).toHaveBeenCalledWith('test-sheet-id', mockRecord);
    });
  });
});
