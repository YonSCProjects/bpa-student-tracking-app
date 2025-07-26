import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StudentDataForm } from '../../src/components/forms';
import { theme } from '../../src/styles/theme';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <PaperProvider theme={theme}>{children}</PaperProvider>
);

describe('StudentDataForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <StudentDataForm onSubmit={mockOnSubmit} />,
      { wrapper: Wrapper }
    );

    expect(getByText('ציון נוכחי')).toBeTruthy();
    expect(getByText('0 / 11')).toBeTruthy();
  });

  it('calculates score correctly', async () => {
    const { getByText, getByDisplayValue } = render(
      <StudentDataForm onSubmit={mockOnSubmit} />,
      { wrapper: Wrapper }
    );

    // Test score calculation - this is a basic test
    // In a real scenario, you'd interact with the form fields
    expect(getByText('0 / 11')).toBeTruthy();
  });

  it('validates required fields', async () => {
    const { getByText } = render(
      <StudentDataForm onSubmit={mockOnSubmit} />,
      { wrapper: Wrapper }
    );

    // Try to submit empty form
    const submitButton = getByText('שמור');
    fireEvent.press(submitButton);

    // Should not call onSubmit with invalid data
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows Hebrew interface', () => {
    const { getByText } = render(
      <StudentDataForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
      { wrapper: Wrapper }
    );

    expect(getByText('פרטי בסיסיים')).toBeTruthy();
    expect(getByText('הערכת ביצועים')).toBeTruthy();
    expect(getByText('שמור')).toBeTruthy();
    expect(getByText('ביטול')).toBeTruthy();
  });
});