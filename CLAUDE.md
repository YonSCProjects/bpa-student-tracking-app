# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# BPApp - Hebrew Student Tracking System

## Project Overview
Hebrew-language cross-platform mobile application for teachers to track student performance and attendance through 11 structured input fields with automatic Google Sheets integration. Each user maintains their own private "BPApp" spreadsheet with real-time score calculation and smart record matching.

## Tech Stack
- **Framework**: React Native with TypeScript
- **Authentication**: Google OAuth 2.0
- **Backend**: Google Sheets API v4
- **Language**: Complete Hebrew with RTL support
- **Platform**: iOS and Android

## Core Functionality

### Data Storage & Synchronization
- **Personal Google Sheets Integration**: Each user maintains private "BPApp" spreadsheet in Google Drive
- **Automatic Authentication**: App checks Google Drive connection on startup
- **Real-time Sync**: Direct Google Sheets API integration for immediate data synchronization
- **Individual User Sheets**: Each teacher gets dedicated spreadsheet ensuring privacy

### Hebrew Input Fields (11 Total)

#### 1. תאריך (Date)
- **Type**: Date picker with popup calendar
- **Behavior**: Auto-populates with current date on app open
- **Format**: Hebrew-compatible date formatting
- **UI**: Tap-to-select calendar interface

#### 2. שם התלמיד (Student Name)
- **Type**: Text field with intelligent autocomplete
- **Data Source**: Previous submissions from user's spreadsheet
- **Trigger**: Autocomplete after 2+ characters
- **Function**: Ensures consistent name spelling

#### 3. שם הכיתה (Class Name)
- **Type**: Text field with autocomplete
- **Data Source**: Previous class names from spreadsheet
- **Trigger**: Suggestions after 2+ characters
- **Purpose**: Maintains class naming consistency

#### 4. מספר השיעור (Class Number)
- **Type**: Number picker (range 1-7)
- **Smart Default**: Auto-suggests next sequential number for current date
- **Logic**: If classes 1,2,3 exist today → suggests class 4
- **Validation**: Only allows 1,2,3,4,5,6,7

#### 5. כניסה (Entry On Time)
- **Type**: Number picker (range 0-1)
- **Values**: 0 = late arrival, 1 = on time
- **UI**: Binary toggle/selector
- **Scoring**: Contributes to total calculation

#### 6. שהייה (Staying in Class)
- **Type**: Number picker (range 0-3)
- **Scoring Logic**: Quarter-hour tracking system
  - 0 = Left early (less than 15 minutes)
  - 1 = Stayed 15 minutes (one quarter)
  - 2 = Stayed 30 minutes (two quarters)
  - 3 = Stayed full class (45+ minutes)

#### 7. אווירה (Attitude)
- **Type**: Number picker (range 0-2)
- **Purpose**: Student behavior and engagement rating
- **Scale**: 3-point evaluation (0,1,2)
- **Assessment**: Behavioral participation aspects

#### 8. ביצוע (Performance)
- **Type**: Number picker (range 0-2)
- **Purpose**: Academic and task performance evaluation
- **Scale**: 3-point system matching attitude
- **Assessment**: Academic achievement focus

#### 9. מטרה אישית (Personal Goal)
- **Type**: Number picker (range 0-2)
- **Purpose**: Individual student objective tracking
- **Integration**: Included in scoring calculation
- **Assessment**: Personal target achievement

#### 10. בונוס (Bonus)
- **Type**: Number picker (range 0-1)
- **Values**: 0 = no bonus, 1 = bonus awarded
- **Purpose**: Extra credit or special recognition
- **Impact**: Contributes to total score

#### 11. הערות (Comments)
- **Type**: Free text field
- **Purpose**: Open-ended notes and observations
- **Validation**: No restrictions
- **Function**: Qualitative information capture

### Advanced Logic & Automation

#### Record Matching System
- **Four-Field Combination**: תאריך + שם התלמיד + שם הכיתה + מספר השיעור
- **Exact Match Required**: All 4 fields must match for auto-population
- **Update vs Create Logic**:
  - **UPDATE Mode**: If all 4 match → Auto-populate fields 5-11 for editing
  - **CREATE Mode**: If no match → Create new spreadsheet row
- **Data Integrity**: Prevents duplicates while allowing updates

#### Real-Time Scoring System
- **Calculated Fields**: Automatically sums inputs 5-10
- **Numeric Inputs**: כניסה(0-1) + שהייה(0-3) + אווירה(0-2) + ביצוע(0-2) + מטרה אישית(0-2) + בונוס(0-1)
- **Maximum Score**: 11 points total
- **Display**: Running total at bottom of form
- **Updates**: Score updates immediately as fields change
- **Storage**: Total saved as additional spreadsheet column

#### Smart Default Behaviors
- **Date Auto-Fill**: Current date on app open
- **Sequential Class Numbers**: Next available number for current date
- **Session Continuity**: Logical daily class tracking flow

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

# Type checking (ALWAYS run before committing)
npm run tsc

# Linting (ALWAYS run before committing)
npm run lint

# Testing
npm run test

# Run specific test file
npm run test -- __tests__/components/StudentDataForm.test.tsx

# Run tests in watch mode
npm run test -- --watch
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

## Project Structure & Architecture

### Key Architecture Decisions
- **State Management**: Zustand stores (authStore.ts, dataStore.ts) for lightweight, non-boilerplate state management
- **Path Aliases**: `@/` prefix for all imports using TypeScript path mapping in tsconfig.json
- **RTL Support**: Forced RTL direction in App.tsx using `forceRTL()` utility
- **Error Handling**: Global ErrorBoundary wraps entire app with performance monitoring
- **Testing**: Jest with React Native Testing Library, transformIgnorePatterns for React Native modules

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── forms/          # StudentDataForm, RecordMatchingForm
│   ├── inputs/         # HebrewTextInput, HebrewNumberPicker, HebrewDatePicker, HebrewAutocompleteInput  
│   └── common/         # ErrorBoundary, LoadingOverlay, NetworkStatus, SyncStatus
├── screens/            # AuthScreen, DataEntryScreen, HomeScreen
├── services/           # External integrations
│   ├── googleSheets/   # GoogleSheetsService with CRUD operations
│   ├── auth/          # GoogleAuthService with OAuth flow
│   ├── storage/       # OfflineStorageService with MMKV
│   └── sync/          # SyncService for data synchronization
├── store/             # Zustand state management
│   ├── authStore.ts   # Authentication state & user data
│   └── dataStore.ts   # Form data, autocomplete suggestions, loading states
├── utils/             # Helper functions
│   ├── scoring.ts     # calculateTotalScore, score color/description logic
│   ├── validation.ts  # Form validation with Hebrew error messages
│   ├── rtl.ts         # RTL direction utilities
│   └── performance.ts # Performance monitoring utilities
├── types/             # TypeScript definitions
│   └── index.ts       # StudentRecord, FormData, GoogleSheetsConfig interfaces
├── constants/         # App constants and configuration
├── localization/      # Hebrew language files (i18n-js)
├── navigation/        # React Navigation setup
├── styles/           # Theme configuration
└── config/           # Environment and app configuration
```

## Google Sheets Integration

### Core Service Architecture
- **GoogleSheetsService**: Main service class in `src/services/googleSheets/GoogleSheetsService.ts`
- **Authentication**: Integrated with GoogleAuthService for token management
- **Error Handling**: Comprehensive error handling with Hebrew error messages
- **Rate Limiting**: Built-in handling for Google Sheets API limits (100 requests/100 seconds/user)

### Key Service Methods
- `findExistingSpreadsheet()`: Searches user's Drive for "BPApp" spreadsheet
- `createSpreadsheet()`: Creates new spreadsheet with Hebrew headers
- `findMatchingRecord()`: Implements 4-field matching logic (תאריך + שם התלמיד + שם הכיתה + מספר השיעור)
- `updateRecord()` / `appendRecord()`: Update existing or create new records
- `fetchAutocompleteData()`: Loads student/class suggestions for autocomplete

### Authentication Flow
1. Google OAuth 2.0 setup via @react-native-google-signin/google-signin
2. Request sheets.spreadsheets scope
3. Store refresh tokens securely using react-native-keychain
4. Automatic token refresh handled by GoogleAuthService

### Data Schema
| תאריך | שם התלמיד | שם הכיתה | מספר השיעור | כניסה | שהייה | אווירה | ביצוע | מטרה אישית | בונוס | סה"כ | הערות |

## Language & Localization

### Full Hebrew Implementation
- **Interface Language**: Complete Hebrew UI including buttons, messages, prompts, labels
- **RTL Support**: Right-to-left text alignment and layout throughout application
- **Hebrew Typography**: Proper Hebrew font support and character rendering
- **Date Formatting**: Hebrew-compatible date display and input systems
- **Google Sheets**: Hebrew column headers matching input field names
- **Error Messages**: All validation and error messages in Hebrew
- **Authentication**: Google Drive prompts in Hebrew

### Hebrew RTL Technical Requirements
- **Text Direction**: Right-to-left layout for all Hebrew content
- **Layout Mirroring**: Interface elements positioned for RTL reading
- **Font Selection**: Hebrew-optimized fonts (Rubik, Assistant, etc.)
- **Number Formatting**: Hebrew interface with numeric input compatibility
- **Mixed Content**: Hebrew text with numeric values support
- **Keyboard Support**: Hebrew keyboard input handling
- **Navigation**: RTL-aware navigation patterns

### RTL Implementation Details
- **React Native RTL Manager**: Enable system-wide RTL support
- **I18nManager**: Configure RTL direction and force restart
- **StyleSheet RTL**: Use start/end instead of left/right positioning
- **Text Components**: Apply writingDirection: 'rtl' for Hebrew
- **Layout Testing**: Verify proper display on both orientations
- **Icon Direction**: Mirror directional icons for RTL consistency

### Input Validation & User Experience
- **Range Enforcement**: UI controls prevent invalid values
- **Number Pickers**: Physical controls eliminate input errors
- **Binary Choices**: Toggle controls for 0/1 values
- **Autocomplete Performance**: 2+ character activation threshold
- **Hebrew Input**: Proper Hebrew keyboard and text handling

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

## User Workflow

### App Launch Sequence
1. **Authentication Check**: Verify Google Drive connection status
2. **Credential Prompt**: Request Google authentication if not connected
3. **Spreadsheet Verification**: Check for "BPApp" spreadsheet in user's Drive
4. **Spreadsheet Creation**: Create "BPApp" with Hebrew headers if missing
5. **Direct Navigation**: Proceed to input form interface

### Data Entry Process
1. **Smart Defaults**: Date pre-filled, class number auto-suggested
2. **Form Completion**: Fill all 11 fields with real-time score display
3. **Record Matching**: Check for existing record (4-field combination)
4. **Auto-Population**: If match found, populate existing data for editing
5. **Score Updates**: Running total updates continuously
6. **Data Submission**: UPDATE existing row or CREATE new record
7. **Immediate Sync**: Real-time Google Sheets synchronization

### Update vs Create Logic Flow
```
Input 4 Key Fields (תאריך + שם התלמיד + שם הכיתה + מספר השיעור)
↓
Search Existing Spreadsheet Records
↓
Exact Match Found?
├─ YES → Auto-populate fields 5-11 → Edit mode → Update existing row
└─ NO → Blank form → Create mode → Add new row
```

## Development Workflow & Testing

### Code Quality Requirements
- **TypeScript**: Strict mode enabled, path aliases configured with `@/` prefix
- **Linting**: ESLint with @react-native config, TypeScript parser
- **Testing**: Comprehensive test suite with Jest + React Native Testing Library
- **Performance**: Built-in performance monitoring in App.tsx initialization

### Test Structure
```
__tests__/
├── components/          # Component unit tests
├── services/           # Service integration tests  
├── utils/             # Utility function tests
├── hooks/             # Custom hook tests
├── integration/       # Full flow integration tests
└── e2e/              # End-to-end Hebrew/RTL tests
```

### Key Testing Patterns
- Hebrew RTL layout testing in `__tests__/e2e/hebrewRTL.test.ts`
- Google Sheets service mocking in integration tests
- Form validation testing with Hebrew error messages
- Scoring calculation unit tests with edge cases

## Known Issues & Limitations
- iOS Hebrew keyboard behavior variations
- Android RTL layout edge cases with keyboards  
- Google Sheets API rate limits (100 requests/100 seconds/user)
- Offline mode requires additional caching implementation (OfflineStorageService exists)
- Hebrew date formatting cross-platform differences

## Environment Variables
```
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
SHEETS_API_KEY=your_google_sheets_api_key
ANDROID_GOOGLE_SERVICES_JSON=path_to_google_services_json
IOS_GOOGLE_SERVICES_PLIST=path_to_google_services_plist
```

## Security & Privacy
- **Personal Storage**: User data in private Google Drive only
- **OAuth 2.0**: Secure Google authentication flow
- **No Central Database**: App doesn't store user data centrally
- **Minimal Permissions**: Only Google Sheets API access required
- **Data Ownership**: Users control all their spreadsheet data

## Deployment
- **Android**: Google Play Console
- **iOS**: App Store Connect
- **Distribution**: Internal testing → Beta → Production

## Support & Maintenance
- Regular dependency updates
- Google API compatibility checks
- Hebrew localization updates
- Performance monitoring