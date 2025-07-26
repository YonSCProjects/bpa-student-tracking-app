import { googleSheetsService } from '../../src/services/googleSheets/GoogleSheetsService';
import { StudentRecord } from '../../src/types';

// Mock the Google Auth Service
jest.mock('../../src/services/auth/GoogleAuthService', () => ({
  googleAuthService: {
    refreshAccessToken: jest.fn().mockResolvedValue('mock-access-token'),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('GoogleSheetsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findMatchingRecord', () => {
    it('finds exact match with 4-field combination', async () => {
      const mockRecords: StudentRecord[] = [
        {
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
        },
        {
          תאריך: '2024-01-15',
          שם_התלמיד: 'שרה לוי',
          שם_הכיתה: 'עברית ב',
          מספר_השיעור: 1,
          כניסה: 1,
          שהייה: 3,
          אווירה: 2,
          ביצוע: 2,
          מטרה_אישית: 2,
          בונוס: 1,
          סהכ: 11,
          הערות: 'מצוין',
        },
      ];

      // Mock getAllRecords
      jest.spyOn(googleSheetsService, 'getAllRecords').mockResolvedValue(mockRecords);

      const match = await googleSheetsService.findMatchingRecord(
        'test-sheet-id',
        '2024-01-15',
        'דוד כהן',
        'מתמטיקה א',
        3
      );

      expect(match).not.toBeNull();
      expect(match?.record.שם_התלמיד).toBe('דוד כהן');
      expect(match?.record.שם_הכיתה).toBe('מתמטיקה א');
      expect(match?.record.מספר_השיעור).toBe(3);
      expect(match?.rowIndex).toBe(2); // First record, +2 for header and 1-based
    });

    it('returns null when no match found', async () => {
      const mockRecords: StudentRecord[] = [
        {
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
        },
      ];

      jest.spyOn(googleSheetsService, 'getAllRecords').mockResolvedValue(mockRecords);

      const match = await googleSheetsService.findMatchingRecord(
        'test-sheet-id',
        '2024-01-15',
        'שרה לוי', // Different student
        'מתמטיקה א',
        3
      );

      expect(match).toBeNull();
    });

    it('requires exact match on all 4 fields', async () => {
      const mockRecords: StudentRecord[] = [
        {
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
        },
      ];

      jest.spyOn(googleSheetsService, 'getAllRecords').mockResolvedValue(mockRecords);

      // Test each field mismatch
      let match = await googleSheetsService.findMatchingRecord(
        'test-sheet-id',
        '2024-01-16', // Different date
        'דוד כהן',
        'מתמטיקה א',
        3
      );
      expect(match).toBeNull();

      match = await googleSheetsService.findMatchingRecord(
        'test-sheet-id',
        '2024-01-15',
        'דוד כהן',
        'עברית ב', // Different class
        3
      );
      expect(match).toBeNull();

      match = await googleSheetsService.findMatchingRecord(
        'test-sheet-id',
        '2024-01-15',
        'דוד כהן',
        'מתמטיקה א',
        4 // Different class number
      );
      expect(match).toBeNull();
    });
  });

  describe('getNextClassNumber', () => {
    it('returns 1 for first class of the day', async () => {
      jest.spyOn(googleSheetsService, 'getAllRecords').mockResolvedValue([]);

      const nextNumber = await googleSheetsService.getNextClassNumber(
        'test-sheet-id',
        '2024-01-15'
      );

      expect(nextNumber).toBe(1);
    });

    it('returns next available number', async () => {
      const mockRecords: StudentRecord[] = [
        {
          תאריך: '2024-01-15',
          שם_התלמיד: 'דוד כהן',
          שם_הכיתה: 'מתמטיקה א',
          מספר_השיעור: 1,
          כניסה: 1,
          שהייה: 2,
          אווירה: 1,
          ביצוע: 2,
          מטרה_אישית: 1,
          בונוס: 0,
          סהכ: 7,
          הערות: '',
        },
        {
          תאריך: '2024-01-15',
          שם_התלמיד: 'שרה לוי',
          שם_הכיתה: 'עברית ב',
          מספר_השיעור: 3, // Missing class 2
          כניסה: 1,
          שהייה: 3,
          אווירה: 2,
          ביצוע: 2,
          מטרה_אישית: 2,
          בונוס: 1,
          סהכ: 11,
          הערות: '',
        },
      ];

      jest.spyOn(googleSheetsService, 'getAllRecords').mockResolvedValue(mockRecords);

      const nextNumber = await googleSheetsService.getNextClassNumber(
        'test-sheet-id',
        '2024-01-15'
      );

      expect(nextNumber).toBe(2); // Should find missing number 2
    });

    it('returns sequential number when no gaps', async () => {
      const mockRecords: StudentRecord[] = [
        {
          תאריך: '2024-01-15',
          שם_התלמיד: 'דוד כהן',
          שם_הכיתה: 'מתמטיקה א',
          מספר_השיעור: 1,
          כניסה: 1,
          שהייה: 2,
          אווירה: 1,
          ביצוע: 2,
          מטרה_אישית: 1,
          בונוס: 0,
          סהכ: 7,
          הערות: '',
        },
        {
          תאריך: '2024-01-15',
          שם_התלמיד: 'שרה לוי',
          שם_הכיתה: 'עברית ב',
          מספר_השיעור: 2,
          כניסה: 1,
          שהייה: 3,
          אווירה: 2,
          ביצוע: 2,
          מטרה_אישית: 2,
          בונוס: 1,
          סהכ: 11,
          הערות: '',
        },
      ];

      jest.spyOn(googleSheetsService, 'getAllRecords').mockResolvedValue(mockRecords);

      const nextNumber = await googleSheetsService.getNextClassNumber(
        'test-sheet-id',
        '2024-01-15'
      );

      expect(nextNumber).toBe(3);
    });

    it('caps at 7 for maximum class number', async () => {
      const mockRecords: StudentRecord[] = Array.from({ length: 7 }, (_, i) => ({
        תאריך: '2024-01-15',
        שם_התלמיד: `תלמיד ${i + 1}`,
        שם_הכיתה: 'כיתה',
        מספר_השיעור: i + 1,
        כניסה: 1,
        שהייה: 2,
        אווירה: 1,
        ביצוע: 2,
        מטרה_אישית: 1,
        בונוס: 0,
        סהכ: 7,
        הערות: '',
      }));

      jest.spyOn(googleSheetsService, 'getAllRecords').mockResolvedValue(mockRecords);

      const nextNumber = await googleSheetsService.getNextClassNumber(
        'test-sheet-id',
        '2024-01-15'
      );

      expect(nextNumber).toBe(7); // Should cap at 7
    });
  });
});