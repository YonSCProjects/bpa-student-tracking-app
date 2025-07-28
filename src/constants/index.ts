export const FIELD_LABELS = {
  תאריך: 'תאריך',
  שם_התלמיד: 'שם התלמיד',
  שם_הכיתה: 'שם הכיתה',
  מספר_השיעור: 'מספר השיעור',
  כניסה: 'כניסה',
  שהייה: 'שהייה',
  אווירה: 'אווירה',
  ביצוע: 'ביצוע',
  מטרה_אישית: 'מטרה אישית',
  בונוס: 'בונוס',
  הערות: 'הערות',
  סהכ: 'סה"כ',
} as const;

export const FIELD_RANGES = {
  מספר_השיעור: { min: 1, max: 7 },
  כניסה: { min: 0, max: 1 },
  שהייה: { min: 0, max: 3 },
  אווירה: { min: 0, max: 2 },
  ביצוע: { min: 0, max: 2 },
  מטרה_אישית: { min: 0, max: 2 },
  בונוס: { min: 0, max: 1 },
} as const;

export const SCORING_FIELDS: (keyof typeof FIELD_RANGES)[] = [
  'כניסה',
  'שהייה',
  'אווירה',
  'ביצוע',
  'מטרה_אישית',
  'בונוס',
];

export const MAXIMUM_SCORE = 11;

export const AUTOCOMPLETE_THRESHOLD = 2;

export const SPREADSHEET_NAME = 'BPApp';

export const SHEET_HEADERS = [
  'תאריך',
  'שם התלמיד',
  'שם הכיתה',
  'מספר השיעור',
  'כניסה',
  'שהייה',
  'אווירה',
  'ביצוע',
  'מטרה אישית',
  'בונוס',
  'סה"כ',
  'הערות',
];

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

export const HEBREW_FONT_FAMILY = 'Assistant-Regular';

export const RTL_DIRECTION = 'rtl' as const;
export const LTR_DIRECTION = 'ltr' as const;
