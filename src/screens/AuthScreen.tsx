import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/localization';
import { hebrewTextStyle } from '@/styles/theme';
import { useAuthStore } from '@/store/authStore';
import { googleAuthService } from '@/services';

const AuthScreen: React.FC = () => {
  const { setAuthenticated, setUser, setTokens } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { user, tokens } = await googleAuthService.signIn();
      
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      
      setTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      
      setAuthenticated(true);
    } catch (error: any) {
      console.error('Authentication error:', error);
      Alert.alert(t('error'), error.message || t('authenticationFailed'));
    } finally {
      setIsLoading(false);
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
              loading={isLoading}
              disabled={isLoading}
            >
              <Text style={hebrewTextStyle}>
                {isLoading ? t('loading') : t('signInWithGoogle')}
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