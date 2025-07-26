import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/localization';
import { hebrewTextStyle } from '@/styles/theme';
import { useAuthStore } from '@/store/authStore';

const AuthScreen: React.FC = () => {
  const { setAuthenticated, setUser } = useAuthStore();

  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement Google Sign-In
      // For now, mock authentication
      setUser({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
      setAuthenticated(true);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineMedium" style={[styles.title, hebrewTextStyle]}>
              {t('appName')}
            </Text>
            <Text variant="bodyLarge" style={[styles.subtitle, hebrewTextStyle]}>
              {t('authenticationRequired')}
            </Text>
            <Button
              mode="contained"
              onPress={handleGoogleSignIn}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              <Text style={hebrewTextStyle}>
                {t('signInWithGoogle')}
              </Text>
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    padding: 30,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
  buttonContent: {
    height: 50,
  },
});

export default AuthScreen;