import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, Card, TouchableRipple } from 'react-native-paper';

import { hebrewTextStyle } from '@/styles/theme';
import { getTextAlign } from '@/utils/rtl';
import { AutocompleteItem } from '@/types';
import { AUTOCOMPLETE_THRESHOLD } from '@/constants';

interface HebrewAutocompleteInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  suggestions: AutocompleteItem[];
  onLoadSuggestions?: (query: string) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

const HebrewAutocompleteInput: React.FC<HebrewAutocompleteInputProps> = ({
  label,
  value,
  onChangeText,
  suggestions,
  onLoadSuggestions,
  error,
  disabled = false,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<AutocompleteItem[]>([]);

  useEffect(() => {
    if (value.length >= AUTOCOMPLETE_THRESHOLD) {
      const filtered = suggestions.filter(item =>
        item.label.includes(value) || item.value.includes(value)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(isFocused && filtered.length > 0);
      
      // Load more suggestions if callback provided
      if (onLoadSuggestions) {
        onLoadSuggestions(value);
      }
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, suggestions, isFocused, onLoadSuggestions]);

  const handleTextChange = (text: string) => {
    onChangeText(text);
  };

  const handleSuggestionPress = (suggestion: AutocompleteItem) => {
    onChangeText(suggestion.value);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value.length >= AUTOCOMPLETE_THRESHOLD && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const renderSuggestion = ({ item }: { item: AutocompleteItem }) => (
    <TouchableRipple
      onPress={() => handleSuggestionPress(item)}
      style={styles.suggestionItem}
    >
      <Text style={[styles.suggestionText, hebrewTextStyle]}>
        {item.label}
      </Text>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[styles.input, hebrewTextStyle]}
        contentStyle={[hebrewTextStyle, { textAlign: getTextAlign() }]}
        error={!!error}
        disabled={disabled}
        mode="outlined"
        placeholder={placeholder}
        right={showSuggestions ? <TextInput.Icon icon="menu-down" /> : null}
      />
      
      {error && (
        <Text style={[styles.errorText, hebrewTextStyle]}>
          {error}
        </Text>
      )}

      {showSuggestions && (
        <Card style={styles.suggestionsContainer}>
          <FlatList
            data={filteredSuggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            maxHeight={200}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1000,
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
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    elevation: 8,
    zIndex: 1000,
    maxHeight: 200,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  suggestionText: {
    fontSize: 16,
    textAlign: 'right',
  },
});

export default HebrewAutocompleteInput;