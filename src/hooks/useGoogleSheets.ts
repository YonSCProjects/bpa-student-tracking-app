import { useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { googleSheetsService } from '@/services';
import { StudentRecord, AutocompleteItem } from '@/types';
import { t } from '@/localization';

export const useGoogleSheets = () => {
  const { isAuthenticated } = useAuthStore();
  const {
    spreadsheetId,
    studentSuggestions,
    classSuggestions,
    isLoadingData,
    isSaving,
    setSpreadsheetId,
    setStudentSuggestions,
    setClassSuggestions,
    setLoadingData,
    setSaving,
  } = useDataStore();

  // Initialize spreadsheet on authentication
  useEffect(() => {
    if (isAuthenticated && !spreadsheetId) {
      initializeSpreadsheet();
    }
  }, [isAuthenticated, spreadsheetId]);

  const initializeSpreadsheet = useCallback(async () => {
    if (!isAuthenticated) {return;}

    setLoadingData(true);
    try {
      const id = await googleSheetsService.findOrCreateSpreadsheet();
      setSpreadsheetId(id);

      // Load initial suggestions
      await loadSuggestions(id);
    } catch (error) {
      console.error('Failed to initialize spreadsheet:', error);
      Alert.alert(t('error'), 'Failed to connect to Google Sheets');
    } finally {
      setLoadingData(false);
    }
  }, [isAuthenticated]);

  const loadSuggestions = useCallback(async (sheetId?: string) => {
    const targetId = sheetId || spreadsheetId;
    if (!targetId) {return;}

    try {
      const [studentNames, classNames] = await Promise.all([
        googleSheetsService.getUniqueStudentNames(targetId),
        googleSheetsService.getUniqueClassNames(targetId),
      ]);

      const studentSuggestions: AutocompleteItem[] = studentNames.map((name, index) => ({
        id: `student-${index}`,
        label: name,
        value: name,
      }));

      const classSuggestions: AutocompleteItem[] = classNames.map((className, index) => ({
        id: `class-${index}`,
        label: className,
        value: className,
      }));

      setStudentSuggestions(studentSuggestions);
      setClassSuggestions(classSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  }, [spreadsheetId]);

  const findMatchingRecord = useCallback(async (
    תאריך: string,
    שם_התלמיד: string,
    שם_הכיתה: string,
    מספר_השיעור: number
  ): Promise<StudentRecord | null> => {
    if (!spreadsheetId) {return null;}

    try {
      const match = await googleSheetsService.findMatchingRecord(
        spreadsheetId,
        תאריך,
        שם_התלמיד,
        שם_הכיתה,
        מספר_השיעור
      );

      return match ? match.record : null;
    } catch (error) {
      console.error('Failed to find matching record:', error);
      return null;
    }
  }, [spreadsheetId]);

  const saveRecord = useCallback(async (
    record: StudentRecord,
    isUpdate: boolean = false
  ): Promise<boolean> => {
    if (!spreadsheetId) {
      Alert.alert(t('error'), 'No spreadsheet available');
      return false;
    }

    setSaving(true);
    try {
      if (isUpdate) {
        // Find existing record to get row index
        const match = await googleSheetsService.findMatchingRecord(
          spreadsheetId,
          record.תאריך,
          record.שם_התלמיד,
          record.שם_הכיתה,
          record.מספר_השיעור
        );

        if (match) {
          await googleSheetsService.updateRecord(spreadsheetId, match.rowIndex, record);
        } else {
          // Record not found, create new one
          await googleSheetsService.createRecord(spreadsheetId, record);
        }
      } else {
        await googleSheetsService.createRecord(spreadsheetId, record);
      }

      // Reload suggestions to include new data
      await loadSuggestions();

      Alert.alert(
        t('success'),
        isUpdate ? t('entryUpdated') : t('entryCreated')
      );

      return true;
    } catch (error) {
      console.error('Failed to save record:', error);
      Alert.alert(t('error'), 'Failed to save record');
      return false;
    } finally {
      setSaving(false);
    }
  }, [spreadsheetId, loadSuggestions]);

  const getNextClassNumber = useCallback(async (date: string): Promise<number> => {
    if (!spreadsheetId) {return 1;}

    try {
      return await googleSheetsService.getNextClassNumber(spreadsheetId, date);
    } catch (error) {
      console.error('Failed to get next class number:', error);
      return 1;
    }
  }, [spreadsheetId]);

  const loadStudentSuggestions = useCallback(async (query: string) => {
    if (query.length < 2 || !spreadsheetId) {return;}

    try {
      const allStudents = await googleSheetsService.getUniqueStudentNames(spreadsheetId);
      const filtered = allStudents
        .filter(name => name.includes(query))
        .map((name, index) => ({
          id: `student-search-${index}`,
          label: name,
          value: name,
        }));

      // Merge with existing suggestions
      const combined = [...studentSuggestions, ...filtered]
        .filter((item, index, arr) =>
          arr.findIndex(i => i.value === item.value) === index
        );

      setStudentSuggestions(combined);
    } catch (error) {
      console.error('Failed to load student suggestions:', error);
    }
  }, [spreadsheetId, studentSuggestions]);

  const loadClassSuggestions = useCallback(async (query: string) => {
    if (query.length < 2 || !spreadsheetId) {return;}

    try {
      const allClasses = await googleSheetsService.getUniqueClassNames(spreadsheetId);
      const filtered = allClasses
        .filter(className => className.includes(query))
        .map((className, index) => ({
          id: `class-search-${index}`,
          label: className,
          value: className,
        }));

      // Merge with existing suggestions
      const combined = [...classSuggestions, ...filtered]
        .filter((item, index, arr) =>
          arr.findIndex(i => i.value === item.value) === index
        );

      setClassSuggestions(combined);
    } catch (error) {
      console.error('Failed to load class suggestions:', error);
    }
  }, [spreadsheetId, classSuggestions]);

  return {
    // State
    spreadsheetId,
    studentSuggestions,
    classSuggestions,
    isLoadingData,
    isSaving,

    // Actions
    initializeSpreadsheet,
    findMatchingRecord,
    saveRecord,
    getNextClassNumber,
    loadStudentSuggestions,
    loadClassSuggestions,
    loadSuggestions,
  };
};
