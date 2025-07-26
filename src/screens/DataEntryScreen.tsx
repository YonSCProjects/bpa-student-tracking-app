import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/localization';
import { hebrewTextStyle } from '@/styles/theme';
import { StudentRecord } from '@/types';
import { calculateTotalScore } from '@/utils/scoring';
import { FIELD_LABELS } from '@/constants';

const DataEntryScreen: React.FC = () => {
  const [formData, setFormData] = useState<Partial<StudentRecord>>({
    תאריך: new Date().toISOString().split('T')[0], // Today's date
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
  });

  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const score = calculateTotalScore(formData);
    setTotalScore(score);
  }, [formData]);

  const handleSave = async () => {
    try {
      // TODO: Implement Google Sheets save logic
      console.log('Saving data:', { ...formData, סהכ: totalScore });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Score Display Card */}
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

          {/* Form Fields Placeholder */}
          <Card style={styles.formCard}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.formTitle, hebrewTextStyle]}>
                {t('dataEntry')}
              </Text>
              
              {/* Placeholder for form fields */}
              <View style={styles.formPlaceholder}>
                <Text style={[styles.placeholderText, hebrewTextStyle]}>
                  טופס הזנת נתונים יתווסף בשלב הבא
                </Text>
                <Text style={[styles.placeholderSubtext, hebrewTextStyle]}>
                  כולל 11 שדות קלט עבריים עם אימות מלא
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                contentStyle={styles.buttonContent}
              >
                <Text style={hebrewTextStyle}>
                  {t('save')}
                </Text>
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  scoreCard: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#2196F3',
  },
  scoreTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 10,
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
    elevation: 2,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  formPlaceholder: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 20,
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  placeholderSubtext: {
    textAlign: 'center',
    opacity: 0.6,
  },
  saveButton: {
    marginTop: 10,
  },
  buttonContent: {
    height: 50,
  },
});

export default DataEntryScreen;