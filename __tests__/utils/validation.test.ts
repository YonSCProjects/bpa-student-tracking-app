import { validateStudentRecord, validateField } from '../../src/utils/validation';
import { StudentRecord } from '../../src/types';

describe('Validation Utils', () => {
  describe('validateStudentRecord', () => {
    it('validates complete valid record', () => {
      const record: Partial<StudentRecord> = {
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
        הערות: 'תלמיד מצוין',
      };

      const result = validateStudentRecord(record);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('validates required fields', () => {
      const record: Partial<StudentRecord> = {};

      const result = validateStudentRecord(record);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      const errorFields = result.errors.map(e => e.field);
      expect(errorFields).toContain('תאריך');
      expect(errorFields).toContain('שם_התלמיד');
      expect(errorFields).toContain('שם_הכיתה');
    });

    it('validates Hebrew characters in student name', () => {
      const record: Partial<StudentRecord> = {
        תאריך: '2024-01-15',
        שם_התלמיד: 'David Cohen', // English name
        שם_הכיתה: 'מתמטיקה א',
      };

      const result = validateStudentRecord(record);
      expect(result.isValid).toBe(false);
      
      const nameError = result.errors.find(e => e.field === 'שם_התלמיד');
      expect(nameError).toBeDefined();
      expect(nameError?.message).toContain('עברית');
    });

    it('validates number ranges', () => {
      const record: Partial<StudentRecord> = {
        תאריך: '2024-01-15',
        שם_התלמיד: 'דוד כהן',
        שם_הכיתה: 'מתמטיקה א',
        מספר_השיעור: 10, // Invalid - should be 1-7
        כניסה: 2, // Invalid - should be 0-1
        שהייה: 5, // Invalid - should be 0-3
      };

      const result = validateStudentRecord(record);
      expect(result.isValid).toBe(false);
      
      const errorFields = result.errors.map(e => e.field);
      expect(errorFields).toContain('מספר_השיעור');
      expect(errorFields).toContain('כניסה');
      expect(errorFields).toContain('שהייה');
    });

    it('validates date format', () => {
      const record: Partial<StudentRecord> = {
        תאריך: 'invalid-date',
        שם_התלמיד: 'דוד כהן',
        שם_הכיתה: 'מתמטיקה א',
      };

      const result = validateStudentRecord(record);
      expect(result.isValid).toBe(false);
      
      const dateError = result.errors.find(e => e.field === 'תאריך');
      expect(dateError).toBeDefined();
    });
  });

  describe('validateField', () => {
    it('validates individual field', () => {
      const error = validateField('שם_התלמיד', '');
      expect(error).not.toBeNull();
      expect(error?.field).toBe('שם_התלמיד');
    });

    it('returns null for valid field', () => {
      const error = validateField('שם_התלמיד', 'דוד כהן');
      expect(error).toBeNull();
    });
  });
});