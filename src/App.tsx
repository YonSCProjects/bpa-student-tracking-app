import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { I18nManager } from 'react-native';

import { AppNavigator } from './navigation/AppNavigator';
import { theme } from './styles/theme';
import { forceRTL } from './utils/rtl';
import { ErrorBoundary, NetworkStatus } from './components/common';
import { performanceMonitor } from './utils/performance';

const App: React.FC = () => {
  useEffect(() => {
    // Performance monitoring
    performanceMonitor.mark('app-start');

    // Ensure RTL is enabled for Hebrew
    forceRTL();

    // Log app initialization
    if (__DEV__) {
      console.log('BPApp initialized successfully');
      performanceMonitor.measure('App Initialization', 'app-start');
    }
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <NetworkStatus showOnlineStatus />
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
