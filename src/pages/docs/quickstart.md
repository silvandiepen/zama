# Quickstart Guide

## Project Setup

This guide will help you get the Zama TFHE API key management application running locally.

### Prerequisites

- **Node.js** 18+ (recommended: latest LTS)
- **pnpm** package manager (recommended) or npm/yarn
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/silvandiepen/zama.git
   cd zama
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

### Development

Start the development server:

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with hot reload
pnpm preview      # Preview production build locally

# Building
pnpm build        # Build for production
pnpm build:watch  # Build with watch mode (if available)

# Testing
pnpm test         # Run unit tests with Vitest
pnpm test:ui      # Run tests with UI interface
pnpm test:run     # Run tests once (CI mode)
pnpm test:e2e     # Run end-to-end tests with Playwright
pnpm test:e2e:ui  # Run E2E tests with UI interface

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues automatically
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Zama Configuration (optional for development)
VITE_ZAMA_NETWORK=testnet
VITE_ZAMA_CONTRACT_ADDRESS=your-contract-address

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

### Features

The application includes:

- **API Key Management**: Create, view, edit, and delete encrypted API keys
- **Zama TFHE Integration**: Homomorphic encryption for sensitive data
- **Authentication**: Login and registration system
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Theme switching capability
- **Internationalization**: Multi-language support (English, French, Dutch)

### Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: SCSS with CSS custom properties
- **State Management**: React Context + useReducer
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Build Tool**: Vite
- **Package Manager**: pnpm (recommended)

### Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components and routing
├── store/             # State management contexts
├── services/          # API and business logic
├── utils/             # Helper functions
├── types/             # TypeScript type definitions
└── styles/            # Global styles and themes
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test them
   ```bash
   pnpm test
   pnpm lint
   ```

3. **Build the project** to ensure everything works
   ```bash
   pnpm build
   ```

4. **Run E2E tests** to verify user flows
   ```bash
   pnpm test:e2e
   ```

### Troubleshooting

#### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 5173
   lsof -ti:5173 | xargs kill -9
   ```

2. **Dependency conflicts**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

3. **TypeScript errors**
   ```bash
   # Check TypeScript configuration
   pnpm build
   ```

#### Getting Help

- Check the browser console for errors
- Review the network tab for API issues
- Ensure all dependencies are properly installed
- Verify environment variables are set correctly

### Production Deployment

For production deployment:

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Preview the build**
   ```bash
   pnpm preview
   ```

3. **Deploy the `dist` folder** to your hosting provider

The build output is optimized for production with:
- Code splitting and lazy loading
- Asset optimization and compression
- Tree shaking for unused code
- Source maps for debugging