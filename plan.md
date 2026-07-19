# code-takes — Auth UI Implementation Plan

## Overview

Build the complete authentication UI for **code-takes**, a platform where developers post coding takes with hashtags, likes, and comments. This plan covers the signup (multi-step with OTP) and login flows using a neo-brutalist design with shadcn v4 on Next.js 16.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, no `src/`) |
| Runtime / PM | Bun |
| UI Components | shadcn v4 (base-lyra, @base-ui/react) |
| Styling | Tailwind CSS v4 (oklch) |
| Icons | Phosphor Icons |
| HTTP Client | Axios |
| Fonts | JetBrains Mono (primary), Geist Sans, Geist Mono |
| Dev Port | 4000 |
| Route Protection | `proxy.ts` (Next.js 16, replaces middleware) |

---

## API Reference (Elysia Backend)

> **Base URL:** set via `NEXT_PUBLIC_API_URL` in `.env.local`

All endpoints return `{ success: boolean, message: string }`. Some also return a `data` field.

### Auth Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/auth/send-otp` | `{ email }` | `{ success, message }` |
| POST | `/auth/verify-otp` | `{ email, otp }` | `{ success, message }` |
| POST | `/auth/signup` | `{ first_name, last_name, email, password, username }` | `{ success, message }` |
| POST | `/auth/login` | `{ email, password }` | `{ success, message }` |
| POST | `/auth/logout` | — | `{ success, message }` |

### User Endpoints

| Method | Endpoint | Body / Params | Response |
|--------|----------|---------------|----------|
| GET | `/users/me` | — | `{ success, message, data: User }` |
| PATCH | `/users/me` | `{ name?, username?, email? }` | `{ success, message, data: User }` |
| DELETE | `/users/me` | — | `{ success, message }` |
| GET | `/users/check-if-username-available/{username}` | path param | `{ success, message }` |

### Types

```ts
interface User {
  id: string
  name: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T = void> {
  success: boolean
  message: string
  data?: T
}

interface SignupPayload {
  first_name: string
  last_name: string
  email: string
  password: string
  username: string
}

interface LoginPayload {
  email: string
  password: string
}

interface OtpPayload {
  email: string
  otp: string
}
```

### Assumptions

- **Cookie-based sessions** — httpOnly cookies set by the Elysia backend
- Axios uses `withCredentials: true` for cross-origin cookie handling
- No JWT in localStorage — purely server-managed

---

## Design: Neo-Brutalist

- **Thick borders:** 2–3px solid black on cards, inputs, buttons
- **Offset shadows:** `4px 4px 0px black` on interactive elements
- **High contrast:** Black & white with accent color pops
- **Monospace everything:** JetBrains Mono already the default font
- **Sharp corners:** 2–4px border-radius
- **Bold type:** Heavy weights, uppercase buttons, large headings
- **Custom alert modals:** Thick-bordered, icon-driven success/error feedback
- **Press feedback:** Buttons shift `translate(2px, 2px)` and reduce shadow on `:active`

### Accent Tokens (added to globals.css)

```css
--accent-green: oklch(0.75 0.18 145);   /* success */
--accent-red: oklch(0.65 0.22 25);       /* error */
--accent-yellow: oklch(0.85 0.16 85);    /* warning */
--accent-blue: oklch(0.65 0.2 250);      /* info / links */
```

### Utility Classes (added to globals.css)

```css
.neo-card     -> border: 2px solid black; box-shadow: 4px 4px 0px black; border-radius: 4px
.neo-btn      -> border: 2px solid black; box-shadow: 3px 3px 0px black; uppercase; tracking-wide; active: translate(2px,2px)
.neo-input    -> border: 2px solid black; border-radius: 2px
```

---

## Auth Flows

### Signup

```
Step 1: Fill Form
+----------------------------------+
|  First Name    |  Last Name      |
|  Username (real-time check)      |
|  Email                           |
|  Password      |  Confirm Pw     |
|                                  |
|  [ Continue -> ]                 |
+----------------------------------+
      | client validation: all filled, passwords match, email valid, username available
      v
      API: POST /auth/send-otp { email }
      |
Step 2: OTP
+----------------------------------+
|  Code sent to user@email.com     |
|                                  |
|  [ _ ][ _ ][ _ ][ _ ][ _ ][ _ ] |
|                                  |
|  Resend code (30s countdown)     |
|                                  |
|  [ Verify -> ]                   |
+----------------------------------+
      v
      API: POST /auth/verify-otp { email, otp }
      v
      API: POST /auth/signup { first_name, last_name, email, password, username }
      v
      API: POST /auth/login { email, password }
      v
      Alert: "Account created!" -> redirect /
```

### Login

```
+----------------------------------+
|  Email                           |
|  Password                        |
|                                  |
|  [ Log In ]                      |
|                                  |
|  No account? Sign up ->          |
+----------------------------------+
      v
      API: POST /auth/login { email, password }
      | error -> Alert with message
      | success -> redirect /
```

---

## Route Protection: `proxy.ts`

Next.js 16 replaces `middleware.ts` with `proxy.ts`. Same API, same matcher config, but the export is named `proxy` and defaults to Node.js runtime (not Edge).

```ts filename="proxy.ts"
import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isProtectedRoute = pathname.startsWith('/') || pathname.startsWith('/settings')

  // Detect session via cookie presence
  // (full validation happens client-side via /users/me)
  const hasSession = request.cookies.has('session') // adjust cookie name to match backend

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['//:path*', '/settings/:path*', '/login', '/signup'],
}
```

---

## File Structure

```
web-code-takes/
+-- .env.local                          # NEXT_PUBLIC_API_URL
+-- proxy.ts                            # Route protection (replaces middleware.ts)
+-- app/
|   +-- globals.css                     # MODIFY -- neo-brutalist utilities + accent tokens
|   +-- layout.tsx                      # MODIFY -- metadata, UserProvider wrapper
|   +-- page.tsx                        # MODIFY -- redirect logic
|   +-- (auth)/
|   |   +-- layout.tsx                  # NEW -- centered auth layout
|   |   +-- login/
|   |   |   +-- page.tsx               # NEW
|   |   +-- signup/
|   |       +-- page.tsx               # NEW
|   +-- (dashboard)/
|       +-- layout.tsx                  # NEW -- navbar + sidebar layout
|       +-- page.tsx                    # NEW -- home/ placeholder
+-- components/
|   +-- alert-modal.tsx                 # NEW -- neo-brutalist alert modal
|   +-- auth/
|   |   +-- auth-card.tsx              # NEW -- shared auth card wrapper
|   |   +-- login-form.tsx             # NEW
|   |   +-- signup-form.tsx            # NEW -- multi-step orchestrator
|   |   +-- signup-step-1.tsx          # NEW -- form fields
|   |   +-- signup-step-2.tsx          # NEW -- OTP verification
|   +-- ui/
|       +-- button.tsx                 # EXISTS
|       +-- card.tsx                   # NEW -- shadcn
|       +-- input.tsx                  # NEW -- shadcn
|       +-- label.tsx                  # NEW -- shadcn
|       +-- otp-input.tsx             # NEW -- custom 6-digit OTP
|       +-- separator.tsx              # NEW -- shadcn
|       +-- skeleton.tsx               # NEW -- shadcn
+-- hooks/
|   +-- use-user.ts                    # NEW -- auth state hook
+-- lib/
    +-- api.ts                         # NEW -- axios instance + typed helpers
    +-- types.ts                       # NEW -- TypeScript types
    +-- user-provider.tsx              # NEW -- React context for user
    +-- utils.ts                       # EXISTS
```

---

## Implementation Order

### Phase 1: Foundation
1. `.env.local` -- API base URL
2. `lib/types.ts` -- all TypeScript interfaces
3. `lib/api.ts` -- Axios instance + typed API functions

### Phase 2: shadcn Components
4. Install: `bunx shadcn@latest add input label card separator skeleton`

### Phase 3: Theme & Global Styles
5. `app/globals.css` -- neo-brutalist utility classes, accent color tokens

### Phase 4: Shared Components
6. `components/alert-modal.tsx` -- success/error alert modal
7. `components/ui/otp-input.tsx` -- 6-digit OTP input
8. `components/auth/auth-card.tsx` -- shared auth card

### Phase 5: Auth Forms
9. `components/auth/signup-step-1.tsx` -- form fields + validation
10. `components/auth/signup-step-2.tsx` -- OTP verification
11. `components/auth/signup-form.tsx` -- multi-step orchestrator
12. `components/auth/login-form.tsx` -- login form

### Phase 6: Auth Pages
13. `app/(auth)/layout.tsx` -- centered auth layout
14. `app/(auth)/signup/page.tsx`
15. `app/(auth)/login/page.tsx`

### Phase 7: Auth State
16. `lib/user-provider.tsx` -- React context
17. `hooks/use-user.ts` -- auth hook
18. Update `app/layout.tsx` -- wrap with UserProvider

### Phase 8: Route Protection
19. `proxy.ts` -- route protection with matcher

### Phase 9: Dashboard (Placeholder)
20. `app/(dashboard)/layout.tsx` -- navbar with user menu + logout
21. `app/(dashboard)/page.tsx` -- welcome page
22. Update `app/page.tsx` -- redirect logic

### Phase 10: Polish
23. Loading skeletons, responsive tweaks, error edge cases

---

## Dependencies

### No new npm packages needed

Everything uses existing deps: axios, shadcn, phosphor-icons, tailwind.

### shadcn Components to Add

```bash
bunx shadcn@latest add input label card separator skeleton
```

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Route protection | `proxy.ts` | Next.js 16 standard (middleware deprecated) |
| Auth state | React Context | Sufficient for auth; can upgrade to Zustand later |
| Session management | Cookie-based (httpOnly) | Server-controlled, secure, no XSS risk |
| Form validation | Client-side only | All fields present + format checks. Server validates auth. |
| State across signup steps | React state in parent | `signup-form.tsx` holds data, passes to child steps |
| No `src/` dir | Follow existing structure | app/ router at project root |
| Route groups | `(auth)`, `(dashboard)` | Separate layouts for auth vs app pages |
