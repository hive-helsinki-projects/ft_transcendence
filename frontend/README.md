# Frontend Documentation

## Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── styles/           # CSS and styling files
│   ├── components/
│   │   ├── features/        # Feature-specific components
│   │   │   ├── auth/       # Authentication components
│   │   │   └── game/       # Game-related components
│   │   ├── layout/         # Layout components
│   │   ├── pages/          # Page components
│   │   ├── routing/        # Routing components
│   │   └── sidebar/        # Sidebar components
│   ├── hooks/
│   │   └── auth/           # Authentication-related hooks
│   ├── services/           # API and service integrations
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── tests/                  # Test files
└── ...                     # Configuration files
```

## Key Features

- **Authentication System**: Complete authentication flow with login and registration
- **Game Interface**: Pong game implementation with real-time updates
- **Dashboard**: User dashboard with game statistics and settings
- **Tournament System**: Tournament management and viewing
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- Vite as build tool
- Custom hooks for state management
- Context API for global state
- CSS Modules for component styling

## Development Guidelines

1. Follow the component structure in `src/components`
2. Use TypeScript for type safety
3. Implement responsive design using Tailwind CSS
4. Write tests for new features
5. Follow the established file naming conventions

## Directory Structure Details

- `components/`: Reusable UI components
- `features/`: Feature-specific components and logic
- `hooks/`: Custom React hooks
- `services/`: API and service integrations
- `store/`: State management
- `types/`: TypeScript type definitions
- `utils/`: Helper functions and constants
- `assets/`: Static assets and styles

Each directory contains its own README.md with specific documentation.
