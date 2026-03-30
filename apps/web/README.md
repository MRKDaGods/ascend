# Web Frontend

Next.js 15 web app with React 19, Material UI 6, and Zustand for state management. Connects to the backend via Axios and Socket.IO for real-time messaging.

## Setup

**Prerequisites:** Node.js 18+

```bash
cd apps/web
npm install
cp .env.example .env.local
# Fill in Firebase client keys in .env.local
npm run dev
```

The dev server runs at `http://localhost:3000` using Turbopack.

The backend must be running for API calls to work. See the [quick start guide](../../README.md#quick-start).

## Environment Variables

See `.env.example` for the required Firebase client config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Project Structure

```
src/app/
  layout.tsx          # Root layout
  page.tsx            # Landing page
  theme.ts            # MUI theme config
  globals.css         # Global styles
  providers/          # React context providers
  components/         # Shared React components
  stores/             # Zustand stores
  hooks/              # Custom React hooks
  types/              # TypeScript interfaces
  utils/              # Helper functions
  feed/               # Feed page
  profile/            # Profile page
  jobs/               # Job listings
  chat/               # Messaging UI
  network/            # Connections page
  premium/            # Subscription page
  admin/              # Admin dashboard
  Company/            # Company pages
  Settings/           # User settings
  notif/              # Notifications
  authen/             # Auth pages
  email/              # Email verification
```

## Key Patterns

### State Management

Zustand stores, one per feature. No Redux. Stores are in `src/app/stores/`:

- `usePostStore` - Feed posts, comments, reactions
- `useUserStore` / `useProfileStore` - User data and profile
- `useJobStore` / `usepJobStore` - Job listings and applications
- `useConnectionStore` - Network connections
- `useNotificationStore` - Notifications
- `chatStore` - Messaging state
- `useSearchStore` - Search
- `useThemeStore` - Theme preferences
- `useCreateCompanyStore` / `useCompanyPostStore` - Company management

### API Layer

Axios-based HTTP client. API calls go through the backend gateway at port 8080. The app also integrates with the Rust WASM API client (`@ascend/api-client`) where available.

### Real-time

Socket.IO client connects to the messaging service (port 3011) for live chat, typing indicators, and read receipts.

### UI

Material UI 6 with Emotion for styling. Custom theme defined in `theme.ts`. Icons from `@mui/icons-material`, `lucide-react`, and `react-icons`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |
