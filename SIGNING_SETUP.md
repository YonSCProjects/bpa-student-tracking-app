# App Signing Setup Guide

## Android Release Signing

### Step 1: Generate Release Keystore

Run this command to generate your release keystore:

```bash
keytool -genkeypair -v -keystore release-key.keystore -alias release-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**When prompted, provide:**
- Your name and organization details
- **IMPORTANT**: Remember the passwords you set!

### Step 2: Configure Signing in gradle.properties

Add these lines to `android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=release-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

### Step 3: Place Keystore File

Move your `release-key.keystore` file to:
```
android/app/release-key.keystore
```

### Step 4: Update .gitignore

Add to your `.gitignore`:
```
# Android keystore
android/app/release-key.keystore
android/gradle.properties
```

## iOS Signing

### For iOS App Store Distribution:

1. **Apple Developer Account Required**
   - Enroll in Apple Developer Program ($99/year)
   - Create App ID in Developer Portal

2. **Certificate Setup**
   - Create Distribution Certificate
   - Create Provisioning Profile for App Store

3. **Xcode Configuration**
   - Open `ios/BPAStudentTracking.xcworkspace`
   - Select your team in Signing & Capabilities
   - Choose "Automatically manage signing" for development
   - Use manual signing for distribution

## Security Notes

⚠️ **CRITICAL SECURITY:**
- **NEVER** commit keystore files to git
- **NEVER** commit passwords to git  
- Store keystore files securely
- Backup keystore files safely
- If you lose the keystore, you cannot update your app!

## Google Play Store Upload Key

For Google Play Store, you can now use Play App Signing:
1. Upload your APK/AAB with your release key
2. Google Play will manage the final signing
3. Your release key becomes the "upload key"

This provides additional security and key management benefits.