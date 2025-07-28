import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { hebrewTextStyle } from '@/styles/theme';
import { getTextAlign } from '@/utils/rtl';

interface HebrewTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

const HebrewTextInput: React.FC<HebrewTextInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  disabled = false,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  maxLength,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, hebrewTextStyle]}
        contentStyle={[hebrewTextStyle, { textAlign: getTextAlign() }]}
        error={!!error}
        disabled={disabled}
        mode="outlined"
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
      />

      {error && (
        <Text style={[styles.errorText, hebrewTextStyle]}>
          {error}
        </Text>
      )}

      {maxLength && (
        <Text style={[styles.counterText, hebrewTextStyle]}>
          {value.length} / {maxLength}
        </Text>
      )}
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
  counterText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'right',
  },
});

export default HebrewTextInput;
