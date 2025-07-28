import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Portal, Modal, Card, Button } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

import { t } from '@/localization';
import { hebrewTextStyle } from '@/styles/theme';
import { getTextAlign } from '@/utils/rtl';

interface HebrewDatePickerProps {
  label: string;
  value: string;
  onDateChange: (date: string) => void;
  error?: string;
  disabled?: boolean;
}

const HebrewDatePicker: React.FC<HebrewDatePickerProps> = ({
  label,
  value,
  onDateChange,
  error,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(value || new Date()));

  const formatHebrewDate = (date: Date): string => {
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date.toISOString().split('T')[0]);
    setIsVisible(false);
  };

  const displayValue = value ? formatHebrewDate(new Date(value)) : '';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <TextInput
          label={label}
          value={displayValue}
          editable={false}
          right={<TextInput.Icon icon="calendar" />}
          style={[styles.input, hebrewTextStyle]}
          contentStyle={[hebrewTextStyle, { textAlign: getTextAlign() }]}
          error={!!error}
          disabled={disabled}
          mode="outlined"
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, hebrewTextStyle]}>
          {error}
        </Text>
      )}

      <Portal>
        <Modal
          visible={isVisible}
          onDismiss={() => setIsVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.datePickerCard}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.modalTitle, hebrewTextStyle]}>
                {t('date')}
              </Text>

              <View style={styles.datePickerContainer}>
                <DatePicker
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  mode="date"
                  locale="he"
                />
              </View>

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setIsVisible(false)}
                  style={styles.modalButton}
                >
                  <Text style={hebrewTextStyle}>{t('cancel')}</Text>
                </Button>

                <Button
                  mode="contained"
                  onPress={() => handleDateConfirm(selectedDate)}
                  style={styles.modalButton}
                >
                  <Text style={hebrewTextStyle}>{t('confirm')}</Text>
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  datePickerCard: {
    elevation: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    minWidth: 100,
  },
});

export default HebrewDatePicker;
