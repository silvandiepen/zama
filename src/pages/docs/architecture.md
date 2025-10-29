# Project Architecture

## Directory Structure

The project follows a well-organized directory structure that promotes scalability and maintainability:

```
src/
├── components/          # Reusable UI components
│   ├── Button/         # Component with tsx, model.ts, .scss
│   ├── Card/           # Same pattern for all components
│   └── ...
├── pages/              # Page-level components
├── services/           # Business logic and data services
├── store/              # State management (Context providers)
├── styles/             # Global styles and design tokens
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and helpers
```

## Component Architecture

Each component follows a consistent folder structure:

- Component.tsx: The main React component file
- model.ts: TypeScript interfaces and types specific to the component
- Component.scss: Component-specific styles using BEM methodology

## State Management Strategy

We use React Context API with custom hooks for state management:

- AuthProvider: User authentication and session management
- ThemeProvider: Theme switching (dark/light mode)
- LocaleProvider: Internationalization and language preferences
- KeysProvider: API key management and data persistence
- ToastProvider: Notification system for user feedback
- FeatureFlagsProvider: Feature toggle management

## Data Layer

The application uses a mock data service pattern that simulates real API calls:

- LocalStorage for data persistence
- Async/await patterns for realistic API simulation
- Service layer separation from UI components
- Type-safe data contracts with TypeScript

