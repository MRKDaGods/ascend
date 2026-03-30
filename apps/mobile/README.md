# Mobile App

Flutter mobile app for Android and iOS. Uses BLoC for state management, Dio for HTTP, and Socket.IO for real-time messaging. Also connects to the backend through a Rust FFI API client via flutter_rust_bridge.

## Setup

**Prerequisites:** Flutter SDK 3.7+, Android Studio or Xcode

```bash
cd apps/mobile
flutter pub get
```

### Firebase Config

Copy the example files and fill in your Firebase credentials:

```bash
cp lib/firebase_options.dart.example lib/firebase_options.dart
cp android/app/google-services.json.example android/app/google-services.json
# Edit both files with your Firebase project values
```

### Run

```bash
flutter run
```

The backend must be running for API calls to work. See the [quick start guide](../../README.md#quick-start).

## Project Structure

```
lib/
  main.dart               # Entry point
  core/
    app/                  # App initialization
    constants/            # App-wide constants
    di/                   # Dependency injection
    error/                # Error handling
    routes/               # Route definitions (app_routes.dart)
  features/
    home/                 # Feed
    profile/              # User profile
    Jobs/                 # Job search and applications
    Messaging/            # Chat
    networks/             # Connections
    notifications/        # Push and in-app
    premium/              # Subscription
    admin/                # Admin panel
    CompanyPage/          # Company profiles
    settings/             # User settings
    StartPages/           # Onboarding and auth
    UserPage/             # Public user profiles
    ProfileViewers/       # Profile view tracking
    groups/               # Groups
    Logo/                 # Splash / branding
  services/               # Push notifications, WebSocket
  shared/                 # Shared widgets, models, navigation, BLoC
  utils/                  # URL helpers, formatters
```

Each feature follows a consistent structure:

```
features/<name>/
  presentation/           # Widgets and pages
  bloc/ or cubit/         # BLoC state management
  repository/             # Data layer
  data/                   # Models and services
```

## Key Patterns

### State Management

BLoC (flutter_bloc 9) for feature-level state. Each feature has its own Bloc or Cubit with events and states. Provider is used for app-level dependency injection.

### Networking

- **Dio** for HTTP requests to the backend gateway
- **Socket.IO client** for real-time messaging
- **Rust FFI client** (flutter_rust_bridge) for typed API calls where available

### Local Storage

- **Hive** for structured local persistence (offline caching)
- **flutter_secure_storage** for auth tokens
- **shared_preferences** for user settings

### Navigation

Centralized route definitions in `core/routes/app_routes.dart`. Named routes throughout the app.

### Push Notifications

Firebase Cloud Messaging (firebase_messaging) for push notifications. flutter_local_notifications for foreground display.

## Commands

| Command | Description |
|---------|-------------|
| `flutter run` | Run on connected device/emulator |
| `flutter test` | Run unit and widget tests |
| `flutter build apk` | Build Android APK |
| `flutter build ios` | Build iOS app |
| `flutter pub get` | Install dependencies |
