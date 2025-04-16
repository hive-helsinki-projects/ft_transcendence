# Frontend Documentation

## Project Overview
The frontend is built using React with TypeScript, utilizing Vite as the build tool. The application follows a modern architecture with clear separation of concerns and uses various modern libraries and tools for development.

## Tech Stack
- **Framework**: React 18.2.0
- **Language**: TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 4.0.17
- **Routing**: React Router DOM 7.4.0
- **Form Handling**: React Hook Form 7.55.0
- **Icons**: Lucide React 0.485.0
- **Font**: Turret Road

## Project Structure

### Core Files
- `main.tsx`: Entry point of the application
- `App.tsx`: Main application component with routing configuration
- `index.html`: HTML template

### Key Directories
1. **src/**
   - `components/`: Reusable UI components
   - `contexts/`: React context providers
   - `pages/`: Main page components
   - `services/`: API and service layer
   - `types/`: TypeScript type definitions
   - `css/`: Stylesheets
   - `data/`: Static data and configurations
   - `game/`: Game-related components
   - `hooks/`: Custom React hooks

### Configuration Files
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite build configuration
- `tailwind.config.cjs`: Tailwind CSS configuration
- `postcss.config.cjs`: PostCSS configuration
- `eslint.config.js`: ESLint configuration
- `prettier.config.js`: Prettier configuration
- `.env`: Environment variables

## Application Architecture

### Routing
The application uses React Router for navigation with the following routes:
- `/`: Landing page
- `/register`: User registration
- `/dashboard`: Protected dashboard
- `/game`: Protected game page
- `/tournament`: Protected tournament page
- `/help`: Protected help page
- `/settings`: Protected settings page

### Authentication
- Uses a custom `AuthProvider` context
- Protected routes implementation using `ProtectedRoute` component
- Authentication state management through `useAuth` hook

### Key Features
1. **Protected Routes**: Authentication-based route protection
2. **Sidebar Navigation**: Persistent navigation component
3. **Game Integration**: Pong game implementation
4. **User Management**: Registration and authentication
5. **Tournament System**: Tournament management
6. **Settings Management**: User preferences and settings

## Dependencies

### Core Dependencies
- `react` & `react-dom`: Core React library
- `react-router-dom`: Client-side routing
- `react-hook-form`: Form handling and validation
- `lucide-react`: Icon library
- `@fontsource/turret-road`: Custom font

### Development Dependencies
- `typescript`: TypeScript support
- `vite`: Build tool and development server
- `tailwindcss`: Utility-first CSS framework
- `eslint`: Code linting
- `prettier`: Code formatting
- `postcss`: CSS processing
- Various TypeScript and React type definitions

## Build and Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build
- `npm run build:css`: Build Tailwind CSS

## Styling
- Uses Tailwind CSS for styling
- Custom PostCSS configuration
- Responsive design support
- Custom font implementation

## Type Safety
- Comprehensive TypeScript configuration
- Type definitions for all major components
- Strict type checking enabled

## Code Quality
- ESLint for code linting
- Prettier for code formatting
- React-specific linting rules
- TypeScript integration

## Environment Configuration
- Environment variables support through `.env`
- Vite environment variable handling
- Development and production configurations

## Deployment
- Docker support through `Dockerfile`
- Production-ready build configuration
- Optimized asset handling

# Frontend Application Architecture
```
┌────────────────────────────────────────────────────────────┐
│                    Entry Point & Routing                   │
│                                                            │
│  ┌─────────┐     ┌─────────┐     ┌──────────────────────┐  │
│  │ main.tsx│────▶│ App.tsx │────▶│ React Router Config  │  │
│  └─────────┘     └─────────┘     └──────────────────────┘  │
└───────────────────────────┬────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│                     Authentication Layer                   │
│                                                            │
│  ┌─────────────┐   ┌──────────┐   ┌───────────────────┐    │
│  │ AuthContext │◀──┤ useAuth  │   │ ProtectedRoute    │    │
│  │   Provider  │──▶│   Hook   │◀──│    Component      │    │
│  └──────┬──────┘   └──────────┘   └───────────────────┘    │
│         │                                                  │
│         ▼                                                  │
│  ┌─────────────┐                                           │
│  │ localAuth   │                                           │
│  │  Service    │                                           │
│  └─────────────┘                                           │
└────────────────────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────┐
│                         Page Components                   │
│                                                           │
│  ┌─────────────┐  ┌────────────┐  ┌────────────────────┐  │
│  │ LandingPage │  │  Register  │  │ Protected Pages    │  │
│  └──────┬──────┘  └─────┬──────┘  │ ┌──────────────┐   │  │
│         │               │         │ │  Dashboard   │   │  │
│         ▼               ▼         │ └──────┬───────┘   │  │
│  ┌─────────────┐  ┌────────────┐  │        │           │  │
│  │    Hero     │  │RegisterForm│  │        ▼           │  │
│  │  Section    │  └────────────┘  │ ┌──────────────┐   │  │
│  └─────────────┘                  │ │ Tournament   │   │  │
│                                   │ └──────┬───────┘   │  │
│                                   │        │           │  │
│                                   │        ▼           │  │
│                                   │ ┌──────────────┐   │  │
│                                   │ │    Help      │   │  │
│                                   │ └──────┬───────┘   │  │
│                                   │        │           │  │
│                                   │        ▼           │  │
│                                   │ ┌──────────────┐   │  │
│                                   │ │  Settings    │   │  │
│                                   │ └──────────────┘   │  │
│                                   └────────────────────┘  │
└───────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────┐
│                  Shared UI Components                      │
│                                                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  SideBar   │  │LoadingState│  │ FormInputs │            │
│  └─────┬──────┘  └────────────┘  └────────────┘            │
│        │                                                   │
│        ▼                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │LogoutButton│  │    Pong    │  │  Reusable  │            │
│  └────────────┘  │ Background │  │ Components │            │
│                  └────────────┘  └────────────┘            │
└────────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────┐
│                      Services Layer                        │
│                                                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │  API       │  │ Auth       │  │ Game               │    │
│  │  Service   │  │ Service    │  │ Service            │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
└────────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────┐
│                      Data Flow                             │
│                                                            │
│  ┌────────────┐     ┌─────────────┐     ┌───────────┐      │
│  │User Actions│────▶│State Updates│────▶│ API Calls │      │
│  └────────────┘     └─────────────┘     └─────┬─────┘      │
│                                               │            │
│  ┌────────────┐     ┌────────────┐     ┌─────▼──────┐      │
│  │  Render    │◀────│Context/State│◀───│ Response   │     │
│  │ Updates    │     │  Updates    │    │ Processing │     │
│  └────────────┘     └────────────┘     └────────────┘      │
└────────────────────────────────────────────────────────────┘
```

   