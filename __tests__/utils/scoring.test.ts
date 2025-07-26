import { calculateTotalScore, getScorePercentage, getScoreDescription } from '../../src/utils/scoring';
import { StudentRecord } from '../../src/types';

describe('Scoring Utils', () => {
  describe('calculateTotalScore', () => {
    it('calculates total score correctly', () => {
      const record: Partial<StudentRecord> = {
        כניסה: 1,
        שהייה: 3,
        אווירה: 2,
        ביצוע: 2,
        מטרה_אישית: 2,
        בונוס: 1,
      };

      const total = calculateTotalScore(record);
      expect(total).toBe(11); // Maximum score
    });

    it('handles partial data', () => {
      const record: Partial<StudentRecord> = {
        כניסה: 1,
        שהייה: 2,
      };

      const total = calculateTotalScore(record);
      expect(total).toBe(3);
    });

    it('handles zero values', () => {
      const record: Partial<StudentRecord> = {
        כניסה: 0,
        שהייה: 0,
        אווירה: 0,
        ביצוע: 0,
        מטרה_אישית: 0,
        בונוס: 0,
      };

      const total = calculateTotalScore(record);
      expect(total).toBe(0);
    });

    it('ignores non-scoring fields', () => {
      const record: Partial<StudentRecord> = {
        תאריך: '2024-01-01',
        שם_התלמיד: 'Test Student',
        שם_הכיתה: 'Test Class',
        מספר_השיעור: 1,
        הערות: 'Test comments',
        כניסה: 1,
        שהייה: 1,
      };

      const total = calculateTotalScore(record);
      expect(total).toBe(2);
    });
  });

  describe('getScorePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(getScorePercentage(11)).toBe(100);
      expect(getScorePercentage(5.5)).toBe(50);
      expect(getScorePercentage(0)).toBe(0);
    });
  });

  describe('getScoreDescription', () => {
    it('returns correct Hebrew descriptions', () => {
      expect(getScoreDescription(11)).toBe('מצוין');
      expect(getScoreDescription(10)).toBe('מצוין');
      expect(getScoreDescription(8)).toBe('טוב מאוד');
      expect(getScoreDescription(6)).toBe('טוב');
      expect(getScoreDescription(3)).toBe('זקוק לשיפור');
      expect(getScoreDescription(0)).toBe('זקוק לשיפור');
    });
  });
});