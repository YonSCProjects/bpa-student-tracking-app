import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { t } from '@/localization';
import { hebrewTextStyle } from '@/styles/theme';
import { useAuthStore } from '@/store/authStore';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { SyncStatus } from '@/components/common';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, signOut } = useAuthStore();

  const handleNewEntry = () => {
    navigation.navigate('DataEntry', {});
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Text variant="headlineSmall" style={[styles.welcome, hebrewTextStyle]}>
              שלום, {user?.name || 'משתמש'}
            </Text>
            <Text variant="bodyMedium" style={[styles.description, hebrewTextStyle]}>
              מערכת מעקב תלמידים - BPApp
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.cardTitle, hebrewTextStyle]}>
              פעולות זמינות
            </Text>
            <Button
              mode="contained"
              onPress={handleNewEntry}
              style={styles.actionButton}
              contentStyle={styles.buttonContent}
            >
              <Text style={hebrewTextStyle}>
                {t('newEntry')}
              </Text>
            </Button>
          </Card.Content>
        </Card>

        <SyncStatus compact />

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={hebrewTextStyle}>
              {t('signOut')}
            </Text>
          </Button>
        </View>
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleNewEntry}
        label={t('newEntry')}
      />
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
    padding: 20,
  },
  welcomeCard: {
    marginBottom: 20,
    elevation: 2,
  },
  welcome: {
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
  },
  actionCard: {
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  actionButton: {
    marginVertical: 5,
  },
  buttonContent: {
    height: 50,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  signOutButton: {
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    left: 16,
    bottom: 16,
  },
});

export default HomeScreen;
