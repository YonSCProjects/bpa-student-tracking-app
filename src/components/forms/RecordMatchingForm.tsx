import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';

import { StudentRecord } from '@/types';
import { hebrewTextStyle } from '@/styles/theme';
import { t } from '@/localization';

interface RecordMatchingFormProps {
  existingRecord: StudentRecord;
  onUseExisting: (record: StudentRecord) => void;
  onCreateNew: () => void;
  onCancel: () => void;
}

const RecordMatchingForm: React.FC<RecordMatchingFormProps> = ({
  existingRecord,
  onUseExisting,
  onCreateNew,
  onCancel,
}) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('he-IL');
    } catch {
      return dateString;
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text variant="titleMedium" style={[styles.title, hebrewTextStyle]}>
          {t('recordFound')}
        </Text>
        
        <Text variant="bodyMedium" style={[styles.subtitle, hebrewTextStyle]}>
          נמצא רישום קיים עם הפרטים הבאים:
        </Text>

        <View style={styles.recordDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, hebrewTextStyle]}>תאריך:</Text>
            <Text style={[styles.value, hebrewTextStyle]}>
              {formatDate(existingRecord.תאריך)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.label, hebrewTextStyle]}>תלמיד:</Text>
            <Text style={[styles.value, hebrewTextStyle]}>
              {existingRecord.שם_התלמיד}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.label, hebrewTextStyle]}>כיתה:</Text>
            <Text style={[styles.value, hebrewTextStyle]}>
              {existingRecord.שם_הכיתה}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.label, hebrewTextStyle]}>מספר שיעור:</Text>
            <Text style={[styles.value, hebrewTextStyle]}>
              {existingRecord.מספר_השיעור}
            </Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={[styles.label, hebrewTextStyle]}>ציון נוכחי:</Text>
            <Chip style={styles.scoreChip}>
              <Text style={hebrewTextStyle}>
                {existingRecord.סהכ || 0} / 11
              </Text>
            </Chip>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => onUseExisting(existingRecord)}
            style={styles.actionButton}
          >
            <Text style={hebrewTextStyle}>ערוך רישום קיים</Text>
          </Button>

          <Button
            mode="outlined"
            onPress={onCreateNew}
            style={styles.actionButton}
          >
            <Text style={hebrewTextStyle}>צור רישום חדש</Text>
          </Button>

          <Button
            mode="text"
            onPress={onCancel}
            style={styles.cancelButton}
          >
            <Text style={hebrewTextStyle}>{t('cancel')}</Text>
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#2196F3',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  recordDetails: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  label: {
    fontWeight: '500',
    color: '#333',
  },
  value: {
    color: '#666',
  },
  scoreChip: {
    backgroundColor: '#2196F3',
  },
  actions: {
    gap: 8,
  },
  actionButton: {
    marginVertical: 4,
  },
  cancelButton: {
    marginTop: 8,
  },
});

export default RecordMatchingForm;