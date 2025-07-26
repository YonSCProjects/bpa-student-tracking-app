import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../src/App';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  }),
}));

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    // Basic smoke test
    expect(getByText).toBeDefined();
  });
});