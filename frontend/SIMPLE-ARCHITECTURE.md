# Simple Frontend Architecture for Beginners

## 🎯 **Why This Structure?**
- **Easy to understand** - Each folder has a clear purpose
- **Predictable** - You always know where to find things
- **Beginner-friendly** - Follows common React patterns
- **Clean** - No unnecessary complexity

## 📁 **Directory Structure**

```
src/
├── pages/              # 📄 Main screens of your app
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── components/         # 🧩 Reusable UI pieces
│   ├── ui/            # Basic components (Button, Input)
│   ├── layout/        # Page structure (Header, Sidebar)
│   └── forms/         # Form components
├── services/          # 🔧 API calls and external services
│   ├── api.ts         # Main API functions
│   └── auth.ts        # Authentication logic
├── hooks/             # 🪝 Custom React hooks
│   ├── useAuth.ts
│   └── useApi.ts
├── utils/             # 🛠️ Helper functions
│   ├── constants.ts
│   └── helpers.ts
├── types/             # 📝 TypeScript type definitions
│   └── index.ts
├── assets/            # 🎨 Images, icons, styles
│   ├── images/
│   └── styles/
└── App.tsx            # 🚀 Main app component
```

## 🧩 **What Goes Where?**

### 📄 **Pages** (`src/pages/`)
- **What**: Complete screens/routes of your app
- **Example**: `Home.tsx`, `Dashboard.tsx`, `Login.tsx`
- **Rule**: One file per page/route

```typescript
// pages/Home.tsx
import React from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/Button'

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <h1>Welcome Home!</h1>
      <Button>Get Started</Button>
    </div>
  )
}

export default Home
```

### 🧩 **Components** (`src/components/`)
- **What**: Reusable pieces of UI
- **Structure**:
  - `ui/` - Basic components (Button, Input, Card)
  - `layout/` - Page structure (Header, Footer, Sidebar)
  - `forms/` - Form-related components

```typescript
// components/ui/Button.tsx
import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button 
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
```

### 🔧 **Services** (`src/services/`)
- **What**: Functions that talk to APIs or handle business logic
- **Example**: Login, fetch data, save settings

```typescript
// services/api.ts
const API_BASE = 'http://localhost:3000/api'

export const fetchUser = async (id: string) => {
  const response = await fetch(`${API_BASE}/users/${id}`)
  return response.json()
}

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return response.json()
}
```

### 🪝 **Hooks** (`src/hooks/`)
- **What**: Custom React hooks for reusable logic
- **Example**: Authentication state, API calls

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      // Validate token and get user
    }
    setLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    // Login logic
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return { user, loading, login, logout }
}
```

## 🎯 **Simple Rules to Follow**

1. **One component per file** - Makes it easy to find things
2. **Use clear names** - `UserProfile.tsx` not `UP.tsx`
3. **Group similar things** - All buttons in `components/ui/`
4. **Keep it simple** - If unsure, put it in the most obvious place

## 📚 **Example Component Organization**

```
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Loading.tsx
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── forms/
    ├── LoginForm.tsx
    └── RegisterForm.tsx
```

## 🚀 **Getting Started**

1. **Start with pages** - Create your main screens first
2. **Extract components** - When you repeat UI, make it a component
3. **Add services** - When you need to fetch data, create service functions
4. **Use hooks** - When you have logic that multiple components need

## ✅ **Benefits for Learning**

- **Easy to navigate** - You always know where to look
- **Follows conventions** - Similar to most React tutorials
- **Room to grow** - Can evolve as you learn more
- **Clear separation** - UI vs logic vs data
- **Beginner-friendly** - No complex abstractions

This structure will help you focus on learning React concepts without getting lost in complex architecture! 