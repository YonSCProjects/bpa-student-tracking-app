# BPA Student Tracking App - Hebrew Mobile Application

## Project Overview
Cross-platform mobile app for teachers to track student performance with 11 Hebrew input fields, Google Sheets integration, and real-time score calculation.

## Tech Stack
- **Framework**: React Native with TypeScript
- **Authentication**: Google OAuth 2.0
- **Backend**: Google Sheets API v4
- **Language**: Hebrew with full RTL support
- **Platform**: iOS and Android

## Core Features

### Input Fields (11 Total)
1. **Date Picker**: Current date (auto-populated)
2. **Student Name**: Text with autocomplete
3. **Class Name**: Text with autocomplete  
4. **Class Number**: Auto-incremented number picker
5. **Score 1-6**: Numeric inputs for calculation (6 fields)
6. **Additional Field**: Toggle/boolean

### Key Functionality
- **Smart Record Matching**: Check if date+student+class+number exist → UPDATE existing row, else CREATE new
- **Real-time Calculation**: Automatic scoring from 6 numeric inputs
- **Google Sheets Integration**: Each user gets personal "BPApp" sheet
- **Hebrew RTL Interface**: Full right-to-left text support
- **Offline Capability**: Local storage with sync when online

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start
```

### Development
```bash
# Run on Android
npm run android

# Run on iOS
npm run ios

# Type checking
npm run tsc

# Linting
npm run lint

# Testing
npm run test
```

### Build & Release
```bash
# Android debug build
npm run build:android:debug

# Android release build
npm run build:android:release

# iOS build (requires Xcode)
npm run build:ios
```

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form-specific components
│   ├── inputs/         # Input field components
│   └── common/         # Common UI elements
├── screens/            # App screens
├── services/           # API and external services
│   ├── googleSheets/   # Google Sheets integration
│   └── auth/          # Authentication logic
├── utils/             # Helper functions
├── types/             # TypeScript type definitions
├── constants/         # App constants
├── localization/      # Hebrew language files
└── assets/           # Images, fonts, etc.
```

## Google Sheets Integration

### Authentication Flow
1. Google OAuth 2.0 setup
2. Request sheets.spreadsheets scope
3. Store refresh tokens securely

### Sheet Operations
- **Create**: New "BPApp" sheet per user
- **Read**: Fetch existing records for matching
- **Update**: Modify existing rows
- **Append**: Add new records

### Data Schema
| Date | Student | Class | Number | Score1 | Score2 | Score3 | Score4 | Score5 | Score6 | Total | Additional |

## Hebrew/RTL Support

### Configuration
- React Native RTL manager
- Hebrew font loading
- Text direction handling
- Layout mirroring

### Best Practices
- Use `writingDirection: 'rtl'` for Hebrew text
- Implement proper keyboard handling
- Test on both LTR/RTL orientations

## Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `hotfix/*`: Critical fixes

### Commit Convention
```
type(scope): description in English

feat(auth): add Google OAuth integration
fix(forms): resolve Hebrew input validation
docs(readme): update setup instructions
```

## Security Considerations
- Secure storage for tokens
- API key protection
- Data validation
- Network security (HTTPS only)

## Testing Strategy
- Unit tests: Components and utilities
- Integration tests: API interactions
- E2E tests: Critical user flows
- RTL layout testing

## Performance Optimization
- Lazy loading components
- Image optimization
- Bundle size monitoring
- Memory leak prevention

## Known Issues & Limitations
- iOS Hebrew keyboard behavior
- Android RTL layout edge cases
- Google Sheets API rate limits

## Environment Variables
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
SHEETS_API_KEY=your_api_key
```

## Deployment
- **Android**: Google Play Console
- **iOS**: App Store Connect
- **Distribution**: Internal testing → Beta → Production

## Support & Maintenance
- Regular dependency updates
- Google API compatibility checks
- Hebrew localization updates
- Performance monitoring