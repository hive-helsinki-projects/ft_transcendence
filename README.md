# ft_transcendence

## 📋 Table of Contents
- [Overview](#overview)
- [Team](#team)
- [Features](#features)
- [Chosen Modules](#chosen-modules)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Roadmap](#roadmap)
- [Authentication System Architecture](#authentication-system-architecture)

## Overview

ft_transcendence is a web-based multiplayer Pong game that integrates real-time gameplay with modern web technologies. Developed as part of our Hive Helsinki project, it pushes us to adapt to new technologies and implement a secure, scalable, and interactive application.

## Team

We are a team of five developers working together to complete this project within a two-month timeframe (01.04 - 01.06). Our focus is on designing an engaging gaming experience while ensuring security and performance best practices.

### Developers
- [Miyuki Ito](https://github.com/ito-miyuki)
- [Kim Matjuhin](https://github.com/k2matu)
- [Valle Vaalanti](https://github.com/Vallehtelia)
- [Oliver Hertzberg](https://github.com/oliverhertzberg)
- [Lumi Kilpeläinen](https://github.com/lkilpela)

## Features

### Core Features
- 🎮 **Pong Gameplay**: Play 1v1 Pong matches & multiplayers locally
- 🔐 **User Management**: Registration, authentication, and user profiles
- 🏆 **Tournament System**: Matchmaking, leaderboards, and competitive play
- 🛡️ **Security**: HTTPS enforcement, input validation, hashed passwords, and protection against SQL injection and XSS
- 🐳 **Dockerized Deployment**: Easy setup with a single command

## Chosen Modules

### Web
- ✅ **Major**: Use a framework to build the backend
- ✅ **Minor**: Use a framework or toolkit to build the frontend
- ✅ **Minor**: Use a database for the backend
- ✅ **Major**: Store the score of a tournament in the Blockchain

### User Management
- ✅ **Major**: Standard user management, authentication, users across tournaments
- ✅ **Major**: Implementing remote authentication

### Gameplay & User Experience
- ✅ **Major**: Multiplayer (more than 2 players in the same game)
- ✅ **Major**: Add another game with user history and matchmaking
- 🎯 **Nice to Have**: Live chat

### Cybersecurity
- ✅ **Major**: Implement Two-Factor Authentication (2FA) and JWT

### Accessibility
- ✅ **Minor**: Expanding browser compatibility
- ✅ **Minor**: Supports multiple languages

## Project Architecture

```mermaid
graph LR

  A[ft_transcendence] -->|Core| B[BACKEND]
  A -->|Core| C[Frontend]
  A -->|Core| D[Game]
  A -->|Core| E[Security]
  A -->|Feature| F[Blockchain]
  A -->|DevOps| G[Deployment]
  A -->|DevOps| H[Testing]

  subgraph B [BACKEND]
    B1[API] --> B1a[Fastify - Routing]
    B1 --> B1b[WebSockets - Real-time]
    B2[Database] --> B2a[SQLite - Persistent]
    B3[Authentication] --> B3a[JWT - if used]
    B3 --> B3b[Secure user validation - Google OAuth]
  end

  subgraph C [Frontend]
    C1[UI] --> C1a[Tailwind CSS]
    C1 --> C1b[Single-Page Application Navigation]
    C2[Logic] --> C2a[TypeScript - Strict] 
    C2 --> C2b[State Management]
  end

  subgraph D [Game]
    D1[Pong Mechanics] --> D1a[Paddle Physics]
    D1 --> D1b[Collision Detection]
    D2[Multiplayer] --> D2a[WebSockets]
    D3[Tournament] --> D3a[Player Registration]
    D3 --> D3b[Score Tracking]
  end

  subgraph E [Security]
    E1[Web Security] --> E1a[SQL Injection]
    E1 --> E1b[XSS Protection]
    E2[Auth Security] --> E2a[Password Hashing]
    E2 --> E2b[HTTPS Enforcement]
  end

  subgraph F [Blockchain]
    F1[Avalanche] --> F1a[Smart Contracts]
    F1 --> F1b[Score Storage]
  end

  subgraph G [Deployment]
    G1[Docker] --> G1a[Containerization]
    G1 --> G1b[One-command startup]
    G2[CI/CD] --> G2a[GitHub Actions]
    G2 --> G2b[Automated Testing]
  end

  subgraph H [Testing]
    H1[Unit Tests] --> H1a[Jest - Backend]
    H1 --> H1b[Supertest - API]
    H2[Frontend Tests] --> H2a[Playwright - UI]
  end

```

## Technology Stack

### Frontend
- TypeScript
- React
- Tailwind CSS

### Backend
- Fastify
- Node.js
- SQLite

### DevOps
- Docker
- GitHub Actions

### Security
- HTTPS
- JWT authentication
- Secure credential storage

## Installation & Setup

1. Clone the repository
2. Run `docker-compose up`
3. Access the application at `http://localhost:xxxx/` (port to be confirmed)

## Development Guidelines

- Follow coding standards and best practices
- Use Git for version control with meaningful commit messages
- Ensure project security and compliance
- Peer-review all contributions before merging

## Roadmap

| Phase | Duration | Tasks |
|-------|----------|-------|
| Planning | Week 1-2 | Initial setup, project planning, architecture decisions |
| Development | Week 3-4 | Core game mechanics, authentication, database integration |
| Enhancement | Week 5-6 | Gameplay improvements, additional features, security implementation |
| Finalization | Week 7-8 | Testing, debugging, and deployment |

## Authentication System Architecture

```mermaid
graph TD
    %% === Frontend ===
    subgraph Frontend
        LP[Landing Page]
        LF[Login Form]
        RF[Register Form]
        GS[Google Sign-In]
        TFA[2FA Input]
        LS[Local Storage]
        AC[Auth Context]
        PR[Protected Routes]
        DASH[Dashboard/Game]
    end

    %% === Backend ===
    subgraph Backend
        RGE[api/users - Register]
        RE[api/login - Login]
        GAUTH[Google Auth]
        TFAV[2FA Verify]
        JWTAuth[JWT Middleware]
        PE[Protected Endpoints]
        DB[(SQLite DB)]
    end

    %% === User Entry Points ===
    LP -->|New User| RF
    LP -->|Existing User - Email/Password| LF
    LP -->|Sign in with Google| GS

    %% === Google Auth Flow ===
    GS -->|OAuth Login| GAUTH
    GAUTH -->|Lookup/Create User| DB
    GAUTH -->|Issue JWT| LS
    LS -->|Set Auth| AC

    %% === Registration Flow ===
    RF -->|POST Register| RGE
    RGE -->|Save Hashed User| DB
    RGE -->|Auto Login| RE

    %% === Login Flow (Shared) ===
    LF -->|POST Login| RE
    RE -->|Verify Credentials| DB
    DB -->|2FA Required?| TFAV
    TFAV -->|Send Code| TFA
    TFA -->|Submit Code| TFAV
    TFAV -->|Verified| RE
    RE -->|Issue JWT| LS
    LS -->|Set Auth| AC

    %% === Authenticated Navigation ===
    AC -->|Check Auth| PR
    PR -->|If Authenticated| DASH
    PR -->|Else| LF

    %% === Protected API Call ===
    DASH -->|Request + JWT| JWTAuth
    JWTAuth -->|Verify Token| PE
    PE -->|Query DB| DB
    DB -->|Return Data| PE
    PE -->|Send Data| DASH

    %% Styling
    classDef frontend fill:#FFFFFF,stroke:#000,stroke-width:2px,color:#000,font-weight:bold
    classDef backend fill:#e8d8ff,stroke:#000,stroke-width:2px,color:#000,font-weight:bold

    class LP,LF,RF,GS,TFA,LS,AC,PR,DASH frontend
    class RGE,RE,GAUTH,TFAV,JWTAuth,PE,DB backend
```

```mermaid
graph TB
    %% === Main Components ===
    subgraph Frontend["Frontend Components"]
        direction TB
        subgraph Entry["Entry Points"]
            LP[Landing Page]
            LF[Login Form]
            RF[Register Form]
            GS[Google Sign-In]
        end
        
        subgraph Auth["Authentication State"]
            LS[Local Storage]
            AC[Auth Context]
            PR[Protected Routes]
        end
        
        subgraph Game["Game Interface"]
            DASH[Dashboard/Game]
        end
    end

    subgraph Backend["Backend Services"]
        direction TB
        subgraph AuthAPI["Authentication API"]
            RGE[Register Endpoint]
            RE[Login Endpoint]
            GAUTH[Google Auth]
            TFAV[2FA Verify]
        end
        
        subgraph Security["Security Layer"]
            JWTAuth[JWT Middleware]
            PE[Protected Endpoints]
        end
        
        subgraph Data["Data Layer"]
            DB[(SQLite DB)]
        end
    end

    %% === Connections ===
    %% Entry Points to Auth API
    Entry -->|"User Credentials"| AuthAPI
    
    %% Auth Flow
    AuthAPI -->|"Validate & Process"| Security
    Security -->|"Store/Retrieve"| Data
    
    %% State Management
    AuthAPI -->|"Update Auth State"| Auth
    Auth -->|"Enable Access"| Game
    
    %% Protected Access
    Game -->|"Secure Request"| Security
    Security -->|"Query"| Data
    Data -->|"Return Data"| Game

    %% === Styling ===
    classDef frontend fill:#FFFFFF,stroke:#000,stroke-width:2px,color:#000,font-weight:bold
    classDef backend fill:#e8d8ff,stroke:#000,stroke-width:2px,color:#000,font-weight:bold
    classDef entry fill:#f0f0f0,stroke:#000,stroke-width:1px
    classDef auth fill:#f0f0f0,stroke:#000,stroke-width:1px
    classDef game fill:#f0f0f0,stroke:#000,stroke-width:1px
    classDef api fill:#e8d8ff,stroke:#000,stroke-width:1px
    classDef security fill:#e8d8ff,stroke:#000,stroke-width:1px
    classDef data fill:#e8d8ff,stroke:#000,stroke-width:1px

    %% === Component Classes ===
    class LP,LF,RF,GS,LS,AC,PR,DASH frontend
    class RGE,RE,GAUTH,TFAV,JWTAuth,PE,DB backend
    class Entry entry
    class Auth auth
    class Game game
    class AuthAPI api
    class Security security
    class Data data
```