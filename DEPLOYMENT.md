# BPApp Deployment Guide

## Prerequisites

### Development Environment
- **Node.js**: Version 18+ 
- **React Native CLI**: Latest version
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **Google Developer Console**: Access for OAuth setup

### Google Cloud Setup
1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google Sheets API and Google Drive API

2. **Configure OAuth 2.0**
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client IDs for:
     - Web application (for development)
     - Android application
     - iOS application (if deploying to iOS)

3. **Get API Keys**
   - Create API key for Google Sheets API
   - Restrict key to specific APIs and domains

## Environment Setup

### 1. Clone and Install
```bash
git clone https://github.com/YonSCProjects/bpa-student-tracking-app.git
cd bpa-student-tracking-app
npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Google credentials
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
GOOGLE_IOS_CLIENT_ID=your_ios_client_id
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
```

### 3. Google Services Configuration

#### Android Setup
1. Download `google-services.json` from Firebase Console
2. Place in `android/app/google-services.json`

#### iOS Setup (if applicable)
1. Download `GoogleService-Info.plist` from Firebase Console  
2. Place in `ios/BPAStudentTracking/GoogleService-Info.plist`

## Development Deployment

### Android Development
```bash
# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android

# For debugging
npx react-native log-android
```

### iOS Development (macOS only)
```bash
# Install iOS dependencies
cd ios && pod install && cd ..

# Run on iOS simulator
npm run ios

# For debugging
npx react-native log-ios
```

## Production Build

### Android Production
```bash
# Generate release APK
cd android
./gradlew assembleRelease

# Generate AAB for Play Store
./gradlew bundleRelease

# Outputs:
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS Production (macOS only)
```bash
# Build for App Store
npm run build:ios

# Or build in Xcode:
# 1. Open ios/BPAStudentTracking.xcworkspace in Xcode
# 2. Select "Any iOS Device" as target
# 3. Product → Archive
# 4. Upload to App Store Connect
```

## Release Preparation

### 1. Version Management
```bash
# Update version in package.json
{
  "version": "1.0.1"
}

# Update Android version
# android/app/build.gradle
versionCode 2
versionName "1.0.1"

# Update iOS version
# ios/BPAStudentTracking/Info.plist
CFBundleShortVersionString: 1.0.1
CFBundleVersion: 2
```

### 2. App Signing

#### Android Signing
```bash
# Generate keystore (one time)
keytool -genkeypair -v -keystore release-key.keystore -alias release-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Add to android/gradle.properties
MYAPP_RELEASE_STORE_FILE=release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=release-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

#### iOS Signing
- Configure in Xcode with Apple Developer account
- Use automatic signing for development
- Use manual signing for distribution

## Store Deployment

### Google Play Store (Android)
1. **Play Console Setup**
   - Create app in [Google Play Console](https://play.google.com/console)
   - Complete store listing with Hebrew description
   - Add screenshots (Hebrew UI)
   - Set content rating and pricing

2. **Upload Build**
   - Upload AAB file to Play Console
   - Complete release notes in Hebrew
   - Submit for review

### App Store (iOS)
1. **App Store Connect Setup**
   - Create app in [App Store Connect](https://appstoreconnect.apple.com)
   - Complete app information with Hebrew localization
   - Add screenshots for all device sizes

2. **Upload Build**
   - Use Xcode or Application Loader
   - Complete App Store review information
   - Submit for review

## Configuration Checklist

### Pre-Deployment
- [ ] Google Cloud APIs enabled
- [ ] OAuth 2.0 credentials configured
- [ ] Environment variables set
- [ ] Google services files in place
- [ ] App icons and splash screens added
- [ ] Version numbers updated
- [ ] Signing certificates configured

### Testing
- [ ] Authentication flow works
- [ ] Google Sheets integration functional
- [ ] Hebrew/RTL display correct
- [ ] Offline mode operational
- [ ] Real-time scoring accurate
- [ ] Form validation working
- [ ] Record matching logic correct

### Store Requirements
- [ ] App store descriptions in Hebrew
- [ ] Screenshots with Hebrew UI
- [ ] Privacy policy (if required)
- [ ] Content rating appropriate
- [ ] Age restrictions set correctly

## Troubleshooting

### Common Issues

#### Google Authentication Fails
- Verify OAuth 2.0 client IDs match package name
- Check SHA-1 fingerprints for Android
- Ensure Google Services files are in correct location

#### Hebrew Text Not Displaying
- Verify RTL manager configuration
- Check font loading in theme.ts
- Ensure proper text direction in styles

#### Offline Mode Not Working
- Check AsyncStorage permissions
- Verify network detection setup
- Test sync service configuration

#### Build Failures
- Clear node_modules and reinstall
- Clean and rebuild native projects
- Check React Native version compatibility

### Support
- **Documentation**: See CLAUDE.md for complete project details
- **Issues**: Report at GitHub repository issues
- **Hebrew Support**: Ensure proper RTL and Hebrew font configuration

## Security Notes

### Production Security
- Never commit `.env` files to repository
- Use secure keystore passwords
- Enable ProGuard for Android release builds
- Configure network security config
- Validate all API inputs
- Use HTTPS only for API calls

### Data Privacy
- User data stored in personal Google Drive only
- No central data collection
- OAuth tokens stored securely
- Offline data encrypted (recommended)

## Monitoring

### Production Monitoring
- Enable crash reporting (optional)
- Monitor API usage quotas
- Track user authentication success rates
- Monitor sync success/failure rates
- Log critical errors only

This deployment guide ensures secure, proper deployment of the Hebrew student tracking application with full Google Sheets integration.