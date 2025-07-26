import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { hebrewTextStyle } from '@/styles/theme';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error?: Error;
    resetError: () => void;
  }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error} 
            resetError={this.resetError} 
          />
        );
      }

      return (
        <View style={styles.container}>
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={[styles.title, hebrewTextStyle]}>
                שגיאה במערכת
              </Text>
              
              <Text variant="bodyMedium" style={[styles.message, hebrewTextStyle]}>
                אירעה שגיאה לא צפויה באפליקציה. אנא נסה שוב או צור קשר עם התמיכה.
              </Text>

              {__DEV__ && this.state.error && (
                <View style={styles.debugInfo}>
                  <Text variant="bodySmall" style={styles.debugText}>
                    {this.state.error.toString()}
                  </Text>
                </View>
              )}

              <Button
                mode="contained"
                onPress={this.resetError}
                style={styles.retryButton}
              >
                <Text style={hebrewTextStyle}>נסה שוב</Text>
              </Button>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  errorCard: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#B00020',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  debugInfo: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  debugText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#B00020',
  },
  retryButton: {
    marginTop: 8,
  },
});

export default ErrorBoundary;