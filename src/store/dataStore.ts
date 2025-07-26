import { create } from 'zustand';
import { StudentRecord, AutocompleteItem } from '@/types';

interface DataState {
  // Spreadsheet info
  spreadsheetId: string | null;
  
  // Data caching
  studentSuggestions: AutocompleteItem[];
  classSuggestions: AutocompleteItem[];
  lastDataUpdate: Date | null;
  
  // Current form state
  currentRecord: Partial<StudentRecord> | null;
  isEditMode: boolean;
  
  // Loading states
  isLoadingData: boolean;
  isSaving: boolean;
  
  // Actions
  setSpreadsheetId: (id: string) => void;
  setStudentSuggestions: (suggestions: AutocompleteItem[]) => void;
  setClassSuggestions: (suggestions: AutocompleteItem[]) => void;
  setCurrentRecord: (record: Partial<StudentRecord> | null) => void;
  setEditMode: (isEdit: boolean) => void;
  setLoadingData: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  clearData: () => void;
}

export const useDataStore = create<DataState>((set) => ({
  // Initial state
  spreadsheetId: null,
  studentSuggestions: [],
  classSuggestions: [],
  lastDataUpdate: null,
  currentRecord: null,
  isEditMode: false,
  isLoadingData: false,
  isSaving: false,
  
  // Actions
  setSpreadsheetId: (id: string) =>
    set({ spreadsheetId: id }),
    
  setStudentSuggestions: (suggestions: AutocompleteItem[]) =>
    set({ studentSuggestions: suggestions, lastDataUpdate: new Date() }),
    
  setClassSuggestions: (suggestions: AutocompleteItem[]) =>
    set({ classSuggestions: suggestions, lastDataUpdate: new Date() }),
    
  setCurrentRecord: (record: Partial<StudentRecord> | null) =>
    set({ currentRecord: record }),
    
  setEditMode: (isEdit: boolean) =>
    set({ isEditMode: isEdit }),
    
  setLoadingData: (loading: boolean) =>
    set({ isLoadingData: loading }),
    
  setSaving: (saving: boolean) =>
    set({ isSaving: saving }),
    
  clearData: () =>
    set({
      spreadsheetId: null,
      studentSuggestions: [],
      classSuggestions: [],
      lastDataUpdate: null,
      currentRecord: null,
      isEditMode: false,
      isLoadingData: false,
      isSaving: false,
    }),
}));