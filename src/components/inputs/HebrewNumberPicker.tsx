import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Portal, Modal, Card, Button, IconButton } from 'react-native-paper';

import { t } from '@/localization';
import { hebrewTextStyle } from '@/styles/theme';
import { getTextAlign } from '@/utils/rtl';

interface HebrewNumberPickerProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  error?: string;
  disabled?: boolean;
  displayLabels?: { [key: number]: string };
}

const HebrewNumberPicker: React.FC<HebrewNumberPickerProps> = ({
  label,
  value,
  onValueChange,
  min,
  max,
  error,
  disabled = false,
  displayLabels,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const increment = () => {
    if (tempValue < max) {
      setTempValue(tempValue + 1);
    }
  };

  const decrement = () => {
    if (tempValue > min) {
      setTempValue(tempValue - 1);
    }
  };

  const handleConfirm = () => {
    onValueChange(tempValue);
    setIsVisible(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsVisible(false);
  };

  const getDisplayValue = (val: number): string => {
    if (displayLabels && displayLabels[val]) {
      return displayLabels[val];
    }
    return val.toString();
  };

  const getValueDescription = (val: number): string => {
    // Special descriptions for scoring fields
    if (min === 0 && max === 1) {
      return val === 1 ? 'כן' : 'לא';
    }
    if (min === 0 && max === 2) {
      const descriptions = ['זקוק לשיפור', 'טוב', 'מצוין'];
      return descriptions[val] || val.toString();
    }
    if (min === 0 && max === 3) {
      const descriptions = ['לא נשאר', '15 דקות', '30 דקות', 'שיעור מלא'];
      return descriptions[val] || val.toString();
    }
    return val.toString();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
        style={[styles.inputContainer, error && styles.inputError]}
      >
        <View style={styles.inputContent}>
          <Text style={[styles.label, hebrewTextStyle]}>{label}</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.value, hebrewTextStyle]}>
              {getDisplayValue(value)}
            </Text>
            <Text style={[styles.description, hebrewTextStyle]}>
              {getValueDescription(value)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, hebrewTextStyle]}>
          {error}
        </Text>
      )}

      <Portal>
        <Modal
          visible={isVisible}
          onDismiss={handleCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.pickerCard}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.modalTitle, hebrewTextStyle]}>
                {label}
              </Text>

              <View style={styles.pickerContainer}>
                <IconButton
                  icon="plus"
                  size={32}
                  onPress={increment}
                  disabled={tempValue >= max}
                  style={styles.pickerButton}
                />

                <View style={styles.valueDisplay}>
                  <Text variant="headlineLarge" style={[styles.pickerValue, hebrewTextStyle]}>
                    {getDisplayValue(tempValue)}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.pickerDescription, hebrewTextStyle]}>
                    {getValueDescription(tempValue)}
                  </Text>
                </View>

                <IconButton
                  icon="minus"
                  size={32}
                  onPress={decrement}
                  disabled={tempValue <= min}
                  style={styles.pickerButton}
                />
              </View>

              <View style={styles.rangeIndicator}>
                <Text style={[styles.rangeText, hebrewTextStyle]}>
                  טווח: {min} - {max}
                </Text>
              </View>

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={styles.modalButton}
                >
                  <Text style={hebrewTextStyle}>{t('cancel')}</Text>
                </Button>

                <Button
                  mode="contained"
                  onPress={handleConfirm}
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
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 16,
    minHeight: 64,
  },
  inputError: {
    borderColor: '#B00020',
  },
  inputContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  valueContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  description: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
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
  pickerCard: {
    elevation: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pickerButton: {
    margin: 10,
  },
  valueDisplay: {
    alignItems: 'center',
    minWidth: 120,
  },
  pickerValue: {
    textAlign: 'center',
    color: '#2196F3',
  },
  pickerDescription: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 5,
  },
  rangeIndicator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rangeText: {
    fontSize: 12,
    opacity: 0.6,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    minWidth: 100,
  },
});

export default HebrewNumberPicker;
