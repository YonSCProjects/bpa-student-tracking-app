# Production Deployment Guide

## Prerequisites Checklist

✅ **Before deploying, ensure you have:**
- [ ] Google Cloud Project configured with APIs enabled
- [ ] OAuth 2.0 credentials for Android (`com.bpapp`) and iOS
- [ ] `.env` file with all your Google credentials
- [ ] `google-services.json` in `android/app/`
- [ ] Release keystore generated and configured
- [ ] App icons and splash screens ready

## Step 1: Final Pre-Production Checks

### Update Version Numbers
```bash
# In package.json
"version": "1.0.0"

# In android/app/build.gradle
versionCode 1
versionName "1.0.0"

# In ios/BPAStudentTracking/Info.plist
CFBundleShortVersionString: 1.0.0
CFBundleVersion: 1
```

### Run Final Tests
```bash
npm run tsc          # TypeScript check
npm run lint         # Code linting
npm run test         # Unit tests
```

## Step 2: Generate Production Builds

### Android Production Build

1. **Generate Release APK:**
   ```bash
   npm run build:android:release
   ```
   Output: `android/app/build/outputs/apk/release/app-release.apk`

2. **Generate AAB for Play Store:**
   ```bash
   npm run build:android:bundle
   ```
   Output: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS Production Build

1. **Build for App Store:**
   ```bash
   npm run build:ios
   ```

2. **Or build in Xcode:**
   - Open `ios/BPAStudentTracking.xcworkspace`
   - Select "Any iOS Device" as target
   - Product → Archive
   - Upload to App Store Connect

## Step 3: Store Deployment

### Google Play Store Deployment

1. **Access Play Console:**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app or select existing

2. **App Information:**
   - **App name**: BPApp (Hebrew Student Tracking)
   - **Description**: Hebrew description of student tracking features
   - **Package name**: com.bpapp
   - **Category**: Education

3. **Store Listing (Hebrew):**
   ```
   Title: BPApp - מעקב תלמידים
   Short description: אפליקציה למעקב נוכחות וביצועי תלמידים בעברית
   Full description: [Detailed Hebrew description of features]
   ```

4. **Upload Build:**
   - Go to Release → Production
   - Upload `app-release.aab` file
   - Complete release notes in Hebrew
   - Submit for review

### App Store Deployment

1. **App Store Connect:**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app

2. **App Information:**
   - **Name**: BPApp - מעקב תלמידים  
   - **Bundle ID**: com.bpapp
   - **Language**: Hebrew (Primary), English (Secondary)

3. **Upload Build:**
   - Use Xcode or Application Loader
   - Complete app information
   - Submit for review

## Step 4: Post-Deployment

### Monitor Launch
- Check crash reports
- Monitor user feedback
- Track authentication success rates
- Monitor Google Sheets API usage

### App Updates
- Version increments: 1.0.0 → 1.0.1 → 1.1.0
- Update both versionCode (Android) and CFBundleVersion (iOS)
- Maintain backward compatibility

## Security Final Checklist

✅ **Before going live:**
- [ ] All API keys secured in environment variables
- [ ] No debug logs in production code
- [ ] ProGuard enabled for Android release
- [ ] HTTPS enforced for all API calls
- [ ] User data stored only in personal Google Drive
- [ ] No sensitive data in app binary

## Store Assets Required

### Screenshots Needed:
- **Phone Screenshots**: 5-8 screenshots showing Hebrew UI
- **Tablet Screenshots**: Optional but recommended
- **Feature Graphic**: 1024x500px promotional image

### App Icons:
- **Android**: Multiple sizes in `android/app/src/main/res/mipmap-*/`
- **iOS**: Multiple sizes in Xcode project

## Troubleshooting Common Issues

### Build Failures:
- Clear caches: `npm run clean:android` and `npm run clean:ios`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check keystore configuration

### Upload Issues:
- Verify package name matches store listing
- Ensure version codes are incremental
- Check app signing configuration

### Post-Launch Issues:
- Monitor Google Play Console for crash reports
- Check App Store Connect for review feedback
- Test authentication flow on different devices

## Success Metrics

Track these metrics post-launch:
- User registration success rate
- Google Sheets sync success rate
- App crashes and ANRs
- User retention and engagement
- App store ratings and reviews

Your app is now ready for production deployment! 🚀