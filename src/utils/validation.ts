import { StudentRecord } from '@/types';
import { FIELD_RANGES } from '@/constants';
import { t } from '@/localization';

export interface ValidationError {
  field: keyof StudentRecord;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateStudentRecord = (record: Partial<StudentRecord>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required field validation
  if (!record.תאריך || record.תאריך.trim() === '') {
    errors.push({
      field: 'תאריך',
      message: `${t('date')} ${t('fieldRequired')}`,
    });
  }

  if (!record.שם_התלמיד || record.שם_התלמיד.trim() === '') {
    errors.push({
      field: 'שם_התלמיד',
      message: `${t('studentName')} ${t('fieldRequired')}`,
    });
  }

  if (!record.שם_הכיתה || record.שם_הכיתה.trim() === '') {
    errors.push({
      field: 'שם_הכיתה',
      message: `${t('className')} ${t('fieldRequired')}`,
    });
  }

  // Date validation
  if (record.תאריך) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(record.תאריך)) {
      errors.push({
        field: 'תאריך',
        message: `${t('date')} ${t('invalidValue')}`,
      });
    } else {
      const date = new Date(record.תאריך);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'תאריך',
          message: `${t('date')} ${t('invalidValue')}`,
        });
      }
    }
  }

  // Number field validation
  Object.entries(FIELD_RANGES).forEach(([field, range]) => {
    const fieldKey = field as keyof typeof FIELD_RANGES;
    const value = record[fieldKey];
    
    if (typeof value === 'number') {
      if (value < range.min || value > range.max) {
        errors.push({
          field: fieldKey,
          message: `${getFieldLabel(fieldKey)} חייב להיות בין ${range.min} ל-${range.max}`,
        });
      }
    }
  });

  // Student name validation (Hebrew characters)
  if (record.שם_התלמיד) {
    const hebrewRegex = /^[\u0590-\u05FF\s]+$/;
    if (!hebrewRegex.test(record.שם_התלמיד)) {
      errors.push({
        field: 'שם_התלמיד',
        message: 'שם התלמיד חייב להכיל תווים בעברית בלבד',
      });
    }
  }

  // Class name validation
  if (record.שם_הכיתה) {
    if (record.שם_הכיתה.length < 2) {
      errors.push({
        field: 'שם_הכיתה',
        message: 'שם הכיתה חייב להכיל לפחות 2 תווים',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateField = (
  field: keyof StudentRecord,
  value: any
): ValidationError | null => {
  const record = { [field]: value } as Partial<StudentRecord>;
  const result = validateStudentRecord(record);
  
  const fieldError = result.errors.find(error => error.field === field);
  return fieldError || null;
};

const getFieldLabel = (field: keyof typeof FIELD_RANGES): string => {
  const labelMap: Record<keyof typeof FIELD_RANGES, string> = {
    מספר_השיעור: t('classNumber'),
    כניסה: t('entry'),
    שהייה: t('staying'),
    אווירה: t('attitude'),
    ביצוע: t('performance'),
    מטרה_אישית: t('personalGoal'),
    בונוס: t('bonus'),
  };
  
  return labelMap[field] || field;
};

export const getFieldError = (
  errors: ValidationError[],
  field: keyof StudentRecord
): string | undefined => {
  const error = errors.find(err => err.field === field);
  return error?.message;
};