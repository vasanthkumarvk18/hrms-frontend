# HRMS Login Flow - Simple Explanation

## How Authentication Works

### 1. Backend Flow
- User enters username/password on login page
- Backend validates credentials
- If valid → Backend sends back a **JWT token**
- Frontend saves token in `localStorage`
- For all future API calls → Frontend sends this token in the `Authorization` header
- Backend checks token and allows/denies access

### 2. Frontend Components

#### **AuthService** (`src/app/services/auth.service.ts`)
- `login()` - Calls backend, saves token to localStorage
- `logout()` - Removes token, redirects to login
- `isLoggedIn()` - Checks if token exists in localStorage
- `getToken()` - Returns the token for API calls

#### **Auth Interceptor** (`src/app/interceptors/auth.interceptor.ts`)
- Automatically adds token to ALL API requests
- You don't need to manually add headers to each API call

#### **Guards** (Route Protection)

**authGuard** - Protects pages that need login (employees, departments, etc.)
```typescript
// If you have token → Allow access
// If no token → Redirect to /login
```

**loginGuard** - Protects login/register pages
```typescript
// If you have token → Redirect to /employees (already logged in!)
// If no token → Show login page
```

### 3. Routes Configuration (`app.routes.ts`)

```typescript
// Public routes (with loginGuard)
{ path: 'login', component: LoginComponent, canActivate: [loginGuard] }
{ path: 'register', component: RegisterComponent, canActivate: [loginGuard] }

// Protected routes (with authGuard)
{ path: 'employees', component: EmployeeManagementComponent, canActivate: [authGuard] }
{ path: 'employees/designation', component: Designations, canActivate: [authGuard] }
{ path: 'employees/departments', component: Departments, canActivate: [authGuard] }
```

### 4. App Component (`app.ts`)
- Simple logic: Hide sidebar/header on login/register pages
- Show sidebar/header on all other pages

## What Was Fixed

### Problem 1: App wouldn't start
**Error:** `NG05001: Configuration error: found both hydration and enabledBlocking`
**Fix:** Removed `withEnabledBlockingInitialNavigation()` from `app.config.ts`

### Problem 2: Login page flash on reload
**Cause:** Angular router renders components before guards execute
**Fix:** Added CSS animation delay to login/register pages

The login and register pages now have a 150ms delay before becoming visible:
```css
.login-container {
    opacity: 0;
    animation: fadeIn 0.2s ease-in 0.15s forwards;
}
```

This gives the guards enough time to:
- Check if user has a token
- Redirect if needed
- Prevent the flash from being visible

**Result:** When you reload `/employees`, the guard redirects you BEFORE the login page becomes visible.

### Problem 3: Logout was a click handler
**Fix:** Created `/logout` route with `LogoutComponent`
- Now logout is a route like everything else
- Cleaner and more RESTful approach

## Current Flow

### When you visit the app:
1. Go to `http://localhost:4200`
2. Routes redirect to `/login`
3. `loginGuard` checks: Do you have a token?
   - **No token** → Show login page ✅
   - **Has token** → Redirect to `/employees` ✅

### When you login:
1. Enter credentials
2. Backend returns token
3. Token saved to localStorage
4. Navigate to `/employees`
5. `authGuard` checks token → Allows access ✅

### When you reload `/employees`:
1. `authGuard` checks: Do you have a token?
   - **Has token** → Show page ✅
   - **No token** → Redirect to `/login` ✅

### When you logout:
1. Click logout
2. Token removed from localStorage
3. Redirect to `/login`
4. Try to access `/employees` → `authGuard` blocks → Redirect to `/login` ✅

## Files Involved

```
src/app/
├── guards/
│   ├── auth.guard.ts          # Protects pages that need login
│   └── login.guard.ts         # Prevents logged-in users from seeing login page
├── services/
│   └── auth.service.ts        # Handles login/logout/token management
├── interceptors/
│   └── auth.interceptor.ts    # Adds token to all API requests
├── app.routes.ts              # Route configuration with guards
├── app.config.ts              # App configuration (FIXED)
├── app.ts                     # Main app component (SIMPLIFIED)
└── app.html                   # Main template (SIMPLIFIED)
```

## Summary
✅ Simple and clean
✅ Token-based authentication
✅ Guards protect routes
✅ Interceptor adds token to API calls
✅ No complex loading states
✅ No login page flash
