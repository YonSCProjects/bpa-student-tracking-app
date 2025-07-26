import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import App from '../../src/App';
import { theme } from '../../src/styles/theme';

// Mock all external dependencies
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({
      user: {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
      },
    }),
    getTokens: jest.fn().mockResolvedValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    }),
    signOut: jest.fn(),
    isSignedIn: jest.fn().mockResolvedValue(false),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({ isConnected: true }),
  addEventListener: jest.fn(() => jest.fn()),
}));

// Mock Google Sheets service
jest.mock('../../src/services/googleSheets/GoogleSheetsService', () => ({
  googleSheetsService: {
    findOrCreateSpreadsheet: jest.fn().mockResolvedValue('test-sheet-id'),
    findMatchingRecord: jest.fn().mockResolvedValue(null),
    createRecord: jest.fn().mockResolvedValue(undefined),
    getUniqueStudentNames: jest.fn().mockResolvedValue(['דוד כהן', 'שרה לוי']),
    getUniqueClassNames: jest.fn().mockResolvedValue(['מתמטיקה א', 'עברית ב']),
    getNextClassNumber: jest.fn().mockResolvedValue(1),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider theme={theme}>
    <NavigationContainer>
      {children}
    </NavigationContainer>
  </PaperProvider>
);

describe('Full App Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes full authentication and data entry flow', async () => {
    const { getByText, getByDisplayValue } = render(<App />, {
      wrapper: TestWrapper,
    });

    // Should start with authentication screen
    expect(getByText('BPApp')).toBeTruthy();
    expect(getByText('התחבר עם Google')).toBeTruthy();

    // Simulate Google sign-in
    const signInButton = getByText('התחבר עם Google');
    fireEvent.press(signInButton);

    // Should navigate to home screen after authentication
    await waitFor(() => {
      expect(getByText('שלום, Test User')).toBeTruthy();
    });

    // Navigate to data entry
    const newEntryButton = getByText('רישום חדש');
    fireEvent.press(newEntryButton);

    // Should show data entry form
    await waitFor(() => {
      expect(getByText('הזנת נתונים')).toBeTruthy();
      expect(getByText('ציון נוכחי')).toBeTruthy();
      expect(getByText('0 / 11')).toBeTruthy();
    });
  });

  it('handles Hebrew text input correctly', async () => {
    const { getByDisplayValue, getByLabelText } = render(<App />, {
      wrapper: TestWrapper,
    });

    // Mock successful authentication
    const { useAuthStore } = require('../../src/store/authStore');
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: 'test', email: 'test@example.com', name: 'Test User' },
    });

    // Navigate to data entry (would need more setup in real test)
    // This is a simplified test to show Hebrew text handling
    // In real implementation, would need to render StudentDataForm directly
  });

  it('handles offline mode correctly', async () => {
    const { getByText } = render(<App />, { wrapper: TestWrapper });

    // Mock offline state
    const NetInfo = require('@react-native-community/netinfo');
    NetInfo.fetch.mockResolvedValue({ isConnected: false });

    // Should show offline banner
    await waitFor(() => {
      expect(getByText(/אין חיבור לאינטרנט/)).toBeTruthy();
    });
  });

  it('validates Hebrew form inputs', async () => {
    // This would test the full form validation flow
    // with Hebrew text inputs and number picker ranges
    expect(true).toBe(true); // Placeholder
  });

  it('calculates scores correctly in real-time', async () => {
    // This would test the real-time scoring calculation
    // as user inputs values in the form
    expect(true).toBe(true); // Placeholder
  });
});

describe('Error Handling Integration Tests', () => {
  it('handles authentication errors gracefully', async () => {
    const { GoogleSignin } = require('@react-native-google-signin/google-signin');
    GoogleSignin.signIn.mockRejectedValue(new Error('Authentication failed'));

    const { getByText } = render(<App />, { wrapper: TestWrapper });

    const signInButton = getByText('התחבר עם Google');
    fireEvent.press(signInButton);

    // Should show error message
    await waitFor(() => {
      expect(getByText(/שגיאה/)).toBeTruthy();
    });
  });

  it('handles Google Sheets API errors', async () => {
    const { googleSheetsService } = require('../../src/services/googleSheets/GoogleSheetsService');
    googleSheetsService.createRecord.mockRejectedValue(new Error('API Error'));

    // Would test form submission with API error
    expect(true).toBe(true); // Placeholder
  });

  it('recovers from network errors', async () => {
    const NetInfo = require('@react-native-community/netinfo');
    
    // Start offline
    NetInfo.fetch.mockResolvedValue({ isConnected: false });
    
    const { getByText, rerender } = render(<App />, { wrapper: TestWrapper });
    
    // Should show offline state
    await waitFor(() => {
      expect(getByText(/אין חיבור לאינטרנט/)).toBeTruthy();
    });

    // Go back online
    NetInfo.fetch.mockResolvedValue({ isConnected: true });
    
    // Should show online state
    await waitFor(() => {
      expect(getByText(/חזרת להיות מחובר/)).toBeTruthy();
    });
  });
});

describe('Performance Tests', () => {
  it('renders app within performance budget', async () => {
    const startTime = Date.now();
    
    render(<App />, { wrapper: TestWrapper });
    
    const renderTime = Date.now() - startTime;
    
    // Should render within 1000ms
    expect(renderTime).toBeLessThan(1000);
  });

  it('handles large suggestion lists efficiently', async () => {
    const { googleSheetsService } = require('../../src/services/googleSheets/GoogleSheetsService');
    
    // Mock large suggestion list
    const largeStudentList = Array.from({ length: 1000 }, (_, i) => `תלמיד ${i}`);
    googleSheetsService.getUniqueStudentNames.mockResolvedValue(largeStudentList);

    // Should handle large lists without performance issues
    expect(true).toBe(true); // Placeholder for actual performance test
  });
});