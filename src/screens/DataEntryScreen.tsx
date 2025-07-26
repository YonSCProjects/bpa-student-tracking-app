import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { StudentDataForm } from '@/components/forms';
import { StudentRecord, AutocompleteItem } from '@/types';
import { RootStackParamList } from '@/navigation/AppNavigator';

type DataEntryScreenRouteProp = RouteProp<RootStackParamList, 'DataEntry'>;
type DataEntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DataEntry'>;

const DataEntryScreen: React.FC = () => {
  const navigation = useNavigation<DataEntryScreenNavigationProp>();
  const route = useRoute<DataEntryScreenRouteProp>();
  
  // Mock data for testing - will be replaced with Google Sheets integration
  const [studentSuggestions] = useState<AutocompleteItem[]>([
    { id: '1', label: 'אברהם כהן', value: 'אברהם כהן' },
    { id: '2', label: 'שרה לוי', value: 'שרה לוי' },
    { id: '3', label: 'דוד מלכה', value: 'דוד מלכה' },
    { id: '4', label: 'רחל אברהם', value: 'רחל אברהם' },
  ]);

  const [classSuggestions] = useState<AutocompleteItem[]>([
    { id: '1', label: 'מתמטיקה א', value: 'מתמטיקה א' },
    { id: '2', label: 'עברית ב', value: 'עברית ב' },
    { id: '3', label: 'היסטוריה', value: 'היסטוריה' },
    { id: '4', label: 'מדעים', value: 'מדעים' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: StudentRecord, isUpdate: boolean) => {
    setIsLoading(true);
    try {
      // TODO: Implement Google Sheets save/update logic
      console.log('Submitting data:', data);
      console.log('Is update:', isUpdate);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to home
      navigation.navigate('Home');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleLoadStudentSuggestions = (query: string) => {
    // TODO: Load suggestions from Google Sheets
    console.log('Loading student suggestions for:', query);
  };

  const handleLoadClassSuggestions = (query: string) => {
    // TODO: Load suggestions from Google Sheets
    console.log('Loading class suggestions for:', query);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StudentDataForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        studentSuggestions={studentSuggestions}
        classSuggestions={classSuggestions}
        onLoadStudentSuggestions={handleLoadStudentSuggestions}
        onLoadClassSuggestions={handleLoadClassSuggestions}
        isLoading={isLoading}
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