# Dash Platform Mobile App

Native mobile application for [Dash Platform](https://www.dash.org/platform/) - a Web3 technology stack for building decentralized applications on the Dash network.

Built with React Native and Expo, based on the **Dash Platform Extension** project.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (LTS)
- iOS: Xcode (Mac only)
- Android: Android Studio
- Expo Go app (for quick testing)

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm start
```

Choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan QR code with Expo Go app

### Platform-Specific Commands

```bash
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web browser
```

## 📚 Documentation

All detailed documentation is in `ai_docs/`:

- **[ai_docs/guides/](ai_docs/guides/)** - Development guides, code examples, contributing
- **[ai_docs/api/](ai_docs/api/)** - Dash Platform, types, services
- **[ai_docs/](ai_docs/README.md)** - Full documentation index
- **[.cursorrules](.cursorrules)** - Quick project reference for AI agents

## 🏗 Tech Stack

- **React Native** 0.81.5
- **React** 19.1.0
- **Expo SDK** ~54.0
- **Expo Router** (file-based routing)
- **TypeScript** ~5.9.2
- **New Architecture** enabled (Fabric + TurboModules)

## 📁 Project Structure

```
app/              # Screens and routes (file-based routing)
components/       # Reusable UI components
  ui/             # UI primitives
hooks/            # Custom React hooks
constants/        # Theme and configuration
assets/           # Images, fonts, etc.
docs/             # Project documentation
```

## 🎯 Dash Platform

This app integrates with **Dash Platform** components:
- **Drive** - Decentralized storage layer
- **DAPI** - Decentralized API for Dash network

See [ai_docs/api/dash-platform.md](ai_docs/api/dash-platform.md) for integration details.

## 🔧 Development

```bash
npm run lint      # ESLint
npx tsc --noEmit  # Type checking
```

### File-Based Routing (Expo Router)

Create files in `app/` directory:
- `app/profile.tsx` → `/profile` route
- `app/settings/index.tsx` → `/settings` route
- `app/[id].tsx` → Dynamic route `/:id`

See [Expo Router docs](https://docs.expo.dev/router/introduction/) for more.

## 🌓 Theme Support

Built-in light/dark mode with `ThemedView` and `ThemedText` components.
Theme configuration in `constants/theme.ts`.

## 📱 Platforms

- ✅ iOS
- ✅ Android
- ✅ Web (limited support)

## 📖 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Dash Platform Docs](https://dashplatform.readme.io/)

## 📄 License

_To be added_
