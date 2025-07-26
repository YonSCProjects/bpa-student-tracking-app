import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { I18nManager } from 'react-native';

import { AppNavigator } from './navigation/AppNavigator';
import { theme } from './styles/theme';
import { forceRTL } from './utils/rtl';

const App: React.FC = () => {
  useEffect(() => {
    // Ensure RTL is enabled for Hebrew
    forceRTL();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;