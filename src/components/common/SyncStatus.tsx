import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, Text, Button, Card } from 'react-native-paper';
import { hebrewTextStyle } from '@/styles/theme';
import { offlineStorageService } from '@/services/storage/OfflineStorageService';
import { syncService, SyncResult } from '@/services/sync/SyncService';

interface SyncStatusProps {
  compact?: boolean;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ compact = false }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    loadPendingCount();

    const interval = setInterval(loadPendingCount, 5000); // Check every 5 seconds

    // Subscribe to sync completion
    const unsubscribe = syncService.onSyncComplete((result) => {
      setLastSyncResult(result);
      setIsSyncing(false);
      loadPendingCount();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const loadPendingCount = async () => {
    try {
      const count = await offlineStorageService.getPendingRecordCount();
      setPendingCount(count);
      setIsSyncing(syncService.getIsSyncing());
    } catch (error) {
      console.error('Failed to load pending count:', error);
    }
  };

  const handleSync = async () => {
    if (isSyncing) {return;}

    setIsSyncing(true);
    try {
      await syncService.syncPendingRecords();
    } catch (error) {
      console.error('Sync failed:', error);
      setIsSyncing(false);
    }
  };

  if (pendingCount === 0 && !lastSyncResult) {
    return null;
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        {pendingCount > 0 && (
          <Chip
            icon="cloud-upload"
            onPress={handleSync}
            disabled={isSyncing}
            style={styles.pendingChip}
          >
            <Text style={hebrewTextStyle}>
              {isSyncing ? 'מסנכרן...' : `${pendingCount} ממתינים לסנכרון`}
            </Text>
          </Chip>
        )}
      </View>
    );
  }

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" style={[styles.title, hebrewTextStyle]}>
            סטטוס סנכרון
          </Text>
        </View>

        {pendingCount > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionText, hebrewTextStyle]}>
              {pendingCount} רישומים ממתינים לסנכרון
            </Text>

            <Button
              mode="contained"
              onPress={handleSync}
              loading={isSyncing}
              disabled={isSyncing}
              style={styles.syncButton}
            >
              <Text style={hebrewTextStyle}>
                {isSyncing ? 'מסנכרן...' : 'סנכרן עכשיו'}
              </Text>
            </Button>
          </View>
        )}

        {lastSyncResult && (
          <View style={styles.section}>
            <Text variant="bodySmall" style={[styles.resultText, hebrewTextStyle]}>
              סנכרון אחרון: {lastSyncResult.synced} הצליחו, {lastSyncResult.failed} נכשלו
            </Text>

            {lastSyncResult.errors.length > 0 && (
              <View style={styles.errorContainer}>
                {lastSyncResult.errors.slice(0, 3).map((error, index) => (
                  <Text
                    key={index}
                    variant="bodySmall"
                    style={[styles.errorText, hebrewTextStyle]}
                  >
                    • {error}
                  </Text>
                ))}
                {lastSyncResult.errors.length > 3 && (
                  <Text variant="bodySmall" style={[styles.errorText, hebrewTextStyle]}>
                    +{lastSyncResult.errors.length - 3} שגיאות נוספות
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    padding: 8,
  },
  pendingChip: {
    backgroundColor: '#FFF3E0',
  },
  container: {
    margin: 16,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    color: '#2196F3',
  },
  section: {
    marginVertical: 8,
  },
  sectionText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  syncButton: {
    marginTop: 8,
  },
  resultText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    textAlign: 'right',
  },
});

export default SyncStatus;
