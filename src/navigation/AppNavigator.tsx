import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '@/store/authStore';

import AuthScreen from '@/screens/AuthScreen';
import HomeScreen from '@/screens/HomeScreen';
import DataEntryScreen from '@/screens/DataEntryScreen';
import { t } from '@/localization';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  DataEntry: { recordId?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'Assistant-Regular',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            title: t('signIn'),
            headerShown: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: t('appName'),
            }}
          />
          <Stack.Screen
            name="DataEntry"
            component={DataEntryScreen}
            options={{
              title: t('dataEntry'),
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
