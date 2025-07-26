import { Platform } from 'react-native';

interface EnvironmentConfig {
  // Google OAuth
  googleWebClientId: string;
  googleAndroidClientId: string;
  googleiOSClientId: string;
  googleSheetsApiKey: string;
  
  // App Info
  appName: string;
  appVersion: string;
  buildNumber: string;
  
  // Environment
  environment: 'development' | 'staging' | 'production';
  debugMode: boolean;
  
  // Storage
  cacheExpiryHours: number;
  maxSyncAttempts: number;
  autoSyncEnabled: boolean;
  
  // Network
  apiTimeout: number;
  retryAttempts: number;
  
  // Features
  enableOfflineMode: boolean;
  enableCrashReporting: boolean;
  enableAnalytics: boolean;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  // In a real app, these would come from environment variables or build configs
  const isDevelopment = __DEV__;
  
  return {
    // Google OAuth - These should be replaced with actual values
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID || 'your-web-client-id',
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || 'your-android-client-id',
    googleiOSClientId: process.env.GOOGLE_IOS_CLIENT_ID || 'your-ios-client-id',
    googleSheetsApiKey: process.env.GOOGLE_SHEETS_API_KEY || 'your-api-key',
    
    // App Info
    appName: 'BPApp',
    appVersion: '1.0.0',
    buildNumber: '1',
    
    // Environment
    environment: isDevelopment ? 'development' : 'production',
    debugMode: isDevelopment,
    
    // Storage
    cacheExpiryHours: 24,
    maxSyncAttempts: 3,
    autoSyncEnabled: true,
    
    // Network
    apiTimeout: 30000, // 30 seconds
    retryAttempts: 3,
    
    // Features
    enableOfflineMode: true,
    enableCrashReporting: !isDevelopment,
    enableAnalytics: !isDevelopment,
  };
};

export const config = getEnvironmentConfig();

// Platform-specific Google Client ID
export const getGoogleClientId = (): string => {
  if (Platform.OS === 'ios') {
    return config.googleiOSClientId;
  } else {
    return config.googleAndroidClientId;
  }
};

// API URLs
export const API_URLS = {
  googleSheets: 'https://sheets.googleapis.com/v4/spreadsheets',
  googleDrive: 'https://www.googleapis.com/drive/v3/files',
  googleOAuth: 'https://oauth2.googleapis.com',
} as const;

// App Constants
export const APP_CONSTANTS = {
  spreadsheetName: 'BPApp',
  sheetName: 'נתונים',
  maxClassNumber: 7,
  minClassNumber: 1,
  maxScoreValue: 11,
  autocompleteThreshold: 2,
} as const;

export default config;