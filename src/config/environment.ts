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
    // Google OAuth - From google-services.json and Firebase Console
    googleWebClientId: '302221962392-t5uk1tmp6bcoem1bhr69accg02nlmneg.apps.googleusercontent.com',
    googleAndroidClientId: '302221962392-t5uk1tmp6bcoem1bhr69accg02nlmneg.apps.googleusercontent.com', 
    googleiOSClientId: 'your-ios-client-id', // Add iOS client when needed
    googleSheetsApiKey: 'AIzaSyBfx2iXCkhz_oRvQyDuupRduXuxU7ZT-tQ', // From google-services.json

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
