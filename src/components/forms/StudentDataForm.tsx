import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';

import {
  HebrewDatePicker,
  HebrewAutocompleteInput,
  HebrewNumberPicker,
  HebrewTextInput,
} from '@/components/inputs';
import { StudentRecord, AutocompleteItem } from '@/types';
import { FIELD_LABELS, FIELD_RANGES } from '@/constants';
import { calculateTotalScore } from '@/utils/scoring';
import { validateStudentRecord, getFieldError, ValidationError } from '@/utils/validation';
import { hebrewTextStyle } from '@/styles/theme';
import { t } from '@/localization';

interface StudentDataFormProps {
  initialData?: Partial<StudentRecord>;
  onSubmit: (data: StudentRecord, isUpdate: boolean) => void;
  onCancel?: () => void;
  studentSuggestions?: AutocompleteItem[];
  classSuggestions?: AutocompleteItem[];
  onLoadStudentSuggestions?: (query: string) => void;
  onLoadClassSuggestions?: (query: string) => void;
  isLoading?: boolean;
}

const StudentDataForm: React.FC<StudentDataFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  studentSuggestions = [],
  classSuggestions = [],
  onLoadStudentSuggestions,
  onLoadClassSuggestions,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<StudentRecord>>({
    תאריך: new Date().toISOString().split('T')[0],
    שם_התלמיד: '',
    שם_הכיתה: '',
    מספר_השיעור: 1,
    כניסה: 0,
    שהייה: 0,
    אווירה: 0,
    ביצוע: 0,
    מטרה_אישית: 0,
    בונוס: 0,
    הערות: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIsEditMode(true);
    }
  }, [initialData]);

  useEffect(() => {
    const score = calculateTotalScore(formData);
    setTotalScore(score);
  }, [formData]);

  const updateField = useCallback((field: keyof StudentRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors.length > 0) {
      setErrors(prev => prev.filter(error => error.field !== field));
    }
  }, [errors.length]);

  const handleSubmit = () => {
    const validation = validateStudentRecord(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const completeData: StudentRecord = {
      תאריך: formData.תאריך || '',
      שם_התלמיד: formData.שם_התלמיד || '',
      שם_הכיתה: formData.שם_הכיתה || '',
      מספר_השיעור: formData.מספר_השיעור || 1,
      כניסה: formData.כניסה || 0,
      שהייה: formData.שהייה || 0,
      אווירה: formData.אווירה || 0,
      ביצוע: formData.ביצוע || 0,
      מטרה_אישית: formData.מטרה_אישית || 0,
      בונוס: formData.בונוס || 0,
      הערות: formData.הערות || '',
      סהכ: totalScore,
    };

    onSubmit(completeData, isEditMode);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Score Display */}
      <Card style={styles.scoreCard}>
        <Card.Content>
          <Text variant="titleLarge" style={[styles.scoreTitle, hebrewTextStyle]}>
            {t('currentScore')}
          </Text>
          <Text variant="headlineLarge" style={[styles.scoreValue, hebrewTextStyle]}>
            {totalScore} / 11
          </Text>
          <Text variant="bodyMedium" style={[styles.scoreLabel, hebrewTextStyle]}>
            {t('points')}
          </Text>
        </Card.Content>
      </Card>

      {/* Form Fields */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.sectionTitle, hebrewTextStyle]}>
            פרטי בסיסיים
          </Text>

          <HebrewDatePicker
            label={FIELD_LABELS.תאריך}
            value={formData.תאריך || ''}
            onDateChange={(date) => updateField('תאריך', date)}
            error={getFieldError(errors, 'תאריך')}
          />

          <HebrewAutocompleteInput
            label={FIELD_LABELS.שם_התלמיד}
            value={formData.שם_התלמיד || ''}
            onChangeText={(text) => updateField('שם_התלמיד', text)}
            suggestions={studentSuggestions}
            onLoadSuggestions={onLoadStudentSuggestions}
            error={getFieldError(errors, 'שם_התלמיד')}
            placeholder="הזן שם התלמיד"
          />

          <HebrewAutocompleteInput
            label={FIELD_LABELS.שם_הכיתה}
            value={formData.שם_הכיתה || ''}
            onChangeText={(text) => updateField('שם_הכיתה', text)}
            suggestions={classSuggestions}
            onLoadSuggestions={onLoadClassSuggestions}
            error={getFieldError(errors, 'שם_הכיתה')}
            placeholder="הזן שם הכיתה"
          />

          <HebrewNumberPicker
            label={FIELD_LABELS.מספר_השיעור}
            value={formData.מספר_השיעור || 1}
            onValueChange={(value) => updateField('מספר_השיעור', value)}
            min={FIELD_RANGES.מספר_השיעור.min}
            max={FIELD_RANGES.מספר_השיעור.max}
            error={getFieldError(errors, 'מספר_השיעור')}
          />

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={[styles.sectionTitle, hebrewTextStyle]}>
            הערכת ביצועים
          </Text>

          <HebrewNumberPicker
            label={FIELD_LABELS.כניסה}
            value={formData.כניסה || 0}
            onValueChange={(value) => updateField('כניסה', value)}
            min={FIELD_RANGES.כניסה.min}
            max={FIELD_RANGES.כניסה.max}
            error={getFieldError(errors, 'כניסה')}
          />

          <HebrewNumberPicker
            label={FIELD_LABELS.שהייה}
            value={formData.שהייה || 0}
            onValueChange={(value) => updateField('שהייה', value)}
            min={FIELD_RANGES.שהייה.min}
            max={FIELD_RANGES.שהייה.max}
            error={getFieldError(errors, 'שהייה')}
          />

          <HebrewNumberPicker
            label={FIELD_LABELS.אווירה}
            value={formData.אווירה || 0}
            onValueChange={(value) => updateField('אווירה', value)}
            min={FIELD_RANGES.אווירה.min}
            max={FIELD_RANGES.אווירה.max}
            error={getFieldError(errors, 'אווירה')}
          />

          <HebrewNumberPicker
            label={FIELD_LABELS.ביצוע}
            value={formData.ביצוע || 0}
            onValueChange={(value) => updateField('ביצוע', value)}
            min={FIELD_RANGES.ביצוע.min}
            max={FIELD_RANGES.ביצוע.max}
            error={getFieldError(errors, 'ביצוע')}
          />

          <HebrewNumberPicker
            label={FIELD_LABELS.מטרה_אישית}
            value={formData.מטרה_אישית || 0}
            onValueChange={(value) => updateField('מטרה_אישית', value)}
            min={FIELD_RANGES.מטרה_אישית.min}
            max={FIELD_RANGES.מטרה_אישית.max}
            error={getFieldError(errors, 'מטרה_אישית')}
          />

          <HebrewNumberPicker
            label={FIELD_LABELS.בונוס}
            value={formData.בונוס || 0}
            onValueChange={(value) => updateField('בונוס', value)}
            min={FIELD_RANGES.בונוס.min}
            max={FIELD_RANGES.בונוס.max}
            error={getFieldError(errors, 'בונוס')}
          />

          <Divider style={styles.divider} />

          <HebrewTextInput
            label={FIELD_LABELS.הערות}
            value={formData.הערות || ''}
            onChangeText={(text) => updateField('הערות', text)}
            multiline
            numberOfLines={3}
            maxLength={500}
            placeholder="הערות נוספות (אופציונלי)"
            error={getFieldError(errors, 'הערות')}
          />
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {onCancel && (
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.button}
            disabled={isLoading}
          >
            <Text style={hebrewTextStyle}>{t('cancel')}</Text>
          </Button>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          <Text style={hebrewTextStyle}>
            {isEditMode ? t('editEntry') : t('save')}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scoreCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 4,
    backgroundColor: '#2196F3',
  },
  scoreTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  scoreValue: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreLabel: {
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  formCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    color: '#2196F3',
  },
  divider: {
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    minWidth: 120,
  },
});

export default StudentDataForm;
