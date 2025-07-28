import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { StudentDataForm } from '@/components/forms';
import { StudentRecord } from '@/types';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useDataStore } from '@/store/dataStore';

type DataEntryScreenRouteProp = RouteProp<RootStackParamList, 'DataEntry'>;
type DataEntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DataEntry'>;

const DataEntryScreen: React.FC = () => {
  const navigation = useNavigation<DataEntryScreenNavigationProp>();
  const route = useRoute<DataEntryScreenRouteProp>();

  const {
    studentSuggestions,
    classSuggestions,
    isSaving,
    findMatchingRecord,
    saveRecord,
    getNextClassNumber,
    loadStudentSuggestions,
    loadClassSuggestions,
  } = useGoogleSheets();

  const {
    currentRecord,
    isEditMode,
    setCurrentRecord,
    setEditMode,
  } = useDataStore();

  const [initialFormData, setInitialFormData] = useState<Partial<StudentRecord> | undefined>();

  // Check for record matching on form field changes
  const checkForMatchingRecord = useCallback(async (
    תאריך: string,
    שם_התלמיד: string,
    שם_הכיתה: string,
    מספר_השיעור: number
  ) => {
    if (!תאריך || !שם_התלמיד || !שם_הכיתה || !מספר_השיעור) {return;}

    try {
      const existingRecord = await findMatchingRecord(
        תאריך,
        שם_התלמיד,
        שם_הכיתה,
        מספר_השיעור
      );

      if (existingRecord) {
        setCurrentRecord(existingRecord);
        setEditMode(true);
        setInitialFormData(existingRecord);
      } else {
        setEditMode(false);
        setCurrentRecord(null);
      }
    } catch (error) {
      console.error('Error checking for matching record:', error);
    }
  }, [findMatchingRecord, setCurrentRecord, setEditMode]);

  // Initialize form with smart defaults
  useFocusEffect(
    useCallback(() => {
      const initializeForm = async () => {
        const today = new Date().toISOString().split('T')[0];
        const nextClassNumber = await getNextClassNumber(today);

        const defaultData: Partial<StudentRecord> = {
          תאריך: today,
          מספר_השיעור: nextClassNumber,
          שם_התלמיד: '',
          שם_הכיתה: '',
          כניסה: 0,
          שהייה: 0,
          אווירה: 0,
          ביצוע: 0,
          מטרה_אישית: 0,
          בונוס: 0,
          הערות: '',
        };

        setInitialFormData(defaultData);
        setCurrentRecord(null);
        setEditMode(false);
      };

      initializeForm();
    }, [getNextClassNumber, setCurrentRecord, setEditMode])
  );

  const handleSubmit = async (data: StudentRecord, isUpdate: boolean) => {
    try {
      const success = await saveRecord(data, isUpdate || isEditMode);

      if (success) {
        // Clear form state
        setCurrentRecord(null);
        setEditMode(false);

        // Navigate back to home
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleCancel = () => {
    setCurrentRecord(null);
    setEditMode(false);
    navigation.goBack();
  };

  // Enhanced form data with auto-population
  const formDataWithAutoPopulation = currentRecord || initialFormData;

  return (
    <SafeAreaView style={styles.container}>
      <StudentDataForm
        initialData={formDataWithAutoPopulation}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        studentSuggestions={studentSuggestions}
        classSuggestions={classSuggestions}
        onLoadStudentSuggestions={loadStudentSuggestions}
        onLoadClassSuggestions={loadClassSuggestions}
        isLoading={isSaving}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default DataEntryScreen;
