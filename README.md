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

### Additional Features
- 🤖 AI opponents
- 💬 Chat functionality
- ♿ Enhanced accessibility

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
graph TD
    %% === Core Components ===
    subgraph Core[Core Components]
        Backend[Backend]
        Frontend[Frontend]
        Game[Game Engine]
        Security[Security]
    end

    %% === Backend ===
    subgraph Backend
        API[API Layer]
        DB[Database]
        Auth[Authentication]
    end

    %% === Frontend ===
    subgraph Frontend
        UI[User Interface]
        State[State Management]
    end

    %% === Game ===
    subgraph Game
        Mechanics[Game Mechanics]
        Multiplayer[Multiplayer]
        Tournament[Tournament]
    end

    %% === Security ===
    subgraph Security
        WebSec[Web Security]
        AuthSec[Auth Security]
    end

    %% === Connections ===
    Core --> Backend
    Core --> Frontend
    Core --> Game
    Core --> Security

    Backend --> API
    Backend --> DB
    Backend --> Auth

    Frontend --> UI
    Frontend --> State

    Game --> Mechanics
    Game --> Multiplayer
    Game --> Tournament

    Security --> WebSec
    Security --> AuthSec
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