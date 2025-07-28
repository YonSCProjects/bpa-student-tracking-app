import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Modal, ActivityIndicator, Text } from 'react-native-paper';
import { hebrewTextStyle } from '@/styles/theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'טוען...',
  transparent = false,
}) => {
  if (!visible) {return null;}

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={[
          styles.container,
          transparent && styles.transparent,
        ]}
      >
        <View style={styles.content}>
          <ActivityIndicator
            size="large"
            color="#2196F3"
            style={styles.indicator}
          />
          {message && (
            <Text
              variant="bodyLarge"
              style={[styles.message, hebrewTextStyle]}
            >
              {message}
            </Text>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 8,
    minWidth: 200,
  },
  indicator: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    color: '#333',
  },
});

export default LoadingOverlay;
