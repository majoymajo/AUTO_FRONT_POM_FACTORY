# React Project Architecture

This project follows a modular architecture designed for scalability and maintainability.

## 📁 Directory Structure

```
src/
├── assets/              # Static assets
│   ├── images/         # Images and media files
│   ├── icons/          # Icon files
│   └── styles/         # Global styles, Tailwind config
│
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Input, Modal, etc.)
│   ├── forms/          # Form-specific components using react-hook-form
│   ├── layouts/        # Layout components (Header, Footer, Sidebar)
│   └── ui/             # PrimeReact wrapper components
│
├── hooks/              # Custom React hooks
│   ├── forms/          # Form-related hooks (useFormValidation, useFieldArray)
│   ├── state/          # Zustand store hooks (useAuthStore, useUserStore)
│   └── data/           # Data fetching hooks (useQuery, useMutation)
│
├── pages/              # Page components (route views)
│   ├── auth/           # Authentication pages (Login, Register, ForgotPassword)
│   ├── dashboard/      # Dashboard page
│   ├── users/          # User management pages
│   └── public/         # Public pages (Home, About, Contact)
│
├── routes/             # Routing configuration
│   └── index.tsx       # Main router setup (React Router)
│
├── services/           # Business logic & API integration
│   ├── api/            # API client configuration & endpoints
│   ├── auth/           # Authentication service
│   └── validation/     # Validation helpers
│
├── schemas/            # Zod validation schemas
│   ├── userSchema.ts   # Example: User validation schema
│   └── authSchema.ts   # Example: Auth validation schema
│
├── store/              # Zustand state management
│   ├── slices/         # Store slices (authSlice, userSlice)
│   └── index.ts        # Store configuration
│
├── types/              # TypeScript type definitions
│   ├── models/         # Data models (User, Product, etc.)
│   └── api/            # API response types
│
└── utils/              # Utility functions
    ├── formatters/     # Data formatters (dates, currency, etc.)
    ├── validators/     # Custom validators
    └── helpers/        # General helper functions
```

## 🛠️ Technology Stack

### UI & Styling
- **PrimeReact**: Component library for rich UI components
- **Tailwind CSS**: Utility-first CSS framework

### State Management
- **Zustand**: Lightweight state management

### Forms & Validation
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation

## 📋 Directory Usage Guidelines

### `/components`
Place all reusable UI components here:
- **common/**: Generic components like Button, Card, Badge
- **forms/**: Form fields integrated with react-hook-form
- **layouts/**: Page layouts and structural components
- **ui/**: PrimeReact component wrappers with custom styling

### `/hooks`
Custom React hooks organized by purpose:
- **forms/**: `useFormWithSchema`, `useFieldValidation`
- **state/**: Zustand store hooks like `useAuthStore`, `useCartStore`
- **data/**: API hooks like `useUsers`, `useProducts`

### `/pages`
Each page component represents a route:
- Group related pages in subdirectories
- Keep pages thin - delegate logic to hooks and services

### `/routes`
Routing configuration:
- Main router setup
- Route guards and protected routes
- Route constants

### `/services`
Business logic and external integrations:
- **api/**: HTTP client setup, interceptors, endpoints
- **auth/**: Authentication logic (login, logout, token management)
- **validation/**: Custom validation utilities

### `/schemas`
Zod schemas for data validation:
- Define schemas for forms, API requests/responses
- Reusable validation logic
- Type inference from schemas

### `/store`
Zustand state management:
- **slices/**: Individual store slices for different domains
- Each slice handles its own state and actions
- Combine slices in main store

### `/types`
TypeScript type definitions:
- **models/**: Domain models (User, Product, Order)
- **api/**: API request/response types
- Shared interfaces and enums

### `/utils`
Pure utility functions:
- **formatters/**: Date, currency, string formatters
- **validators/**: Custom validation functions
- **helpers/**: General-purpose utilities

## 🎯 Example Usage Patterns

### Form with Validation (react-hook-form + zod)
```typescript
// schemas/loginSchema.ts
// services/api/authService.ts
// hooks/forms/useLoginForm.ts
// pages/auth/Login.tsx
```

### State Management (Zustand)
```typescript
// store/slices/authSlice.ts
// hooks/state/useAuthStore.ts
// pages/dashboard/Dashboard.tsx
```

### API Integration
```typescript
// services/api/client.ts
// services/api/userService.ts
// hooks/data/useUsers.ts
// pages/users/UserList.tsx
```

### Component with PrimeReact + Tailwind
```typescript
// components/ui/CustomButton.tsx (PrimeReact Button + Tailwind)
// components/common/UserCard.tsx (uses CustomButton)
```

## 🚀 Best Practices

1. **Single Responsibility**: Each file should have one clear purpose
2. **Co-location**: Keep related files close together
3. **Barrel Exports**: Use index.ts files for clean imports
4. **Type Safety**: Leverage TypeScript and Zod for runtime validation
5. **Separation of Concerns**: Keep UI, logic, and state separate
6. **Reusability**: Build components and hooks to be reusable
7. **Consistent Naming**: Use clear, descriptive names

## 📦 Dependencies Structure

- **PrimeReact** → `components/ui/` wrapper components
- **Tailwind CSS** → `assets/styles/` + inline classes
- **React Hook Form** → `hooks/forms/` + `pages/`
- **Zod** → `schemas/` validation schemas
- **Zustand** → `store/slices/` + `hooks/state/`
