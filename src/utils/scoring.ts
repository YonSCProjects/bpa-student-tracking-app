import { SCORING_FIELDS, MAXIMUM_SCORE } from '@/constants';
import { StudentRecord } from '@/types';

export const calculateTotalScore = (record: Partial<StudentRecord>): number => {
  let total = 0;

  SCORING_FIELDS.forEach(field => {
    const value = record[field];
    if (typeof value === 'number' && !isNaN(value)) {
      total += value;
    }
  });

  return Math.min(total, MAXIMUM_SCORE);
};

export const getScorePercentage = (score: number): number => {
  return Math.round((score / MAXIMUM_SCORE) * 100);
};

export const getScoreColor = (score: number): string => {
  const percentage = getScorePercentage(score);

  if (percentage >= 90) {return '#4CAF50';} // Green
  if (percentage >= 70) {return '#FF9800';} // Orange
  if (percentage >= 50) {return '#FFC107';} // Yellow
  return '#F44336'; // Red
};

export const getScoreDescription = (score: number): string => {
  const percentage = getScorePercentage(score);

  if (percentage >= 90) {return 'מצוין';}
  if (percentage >= 70) {return 'טוב מאוד';}
  if (percentage >= 50) {return 'טוב';}
  return 'זקוק לשיפור';
};
