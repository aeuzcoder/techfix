# TechFix - Web Application

A complete, production-ready Next.js application for computer repair guidance and technical diagnostics.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Firebase Project configured (Web + Admin SDK)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/techfix

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

ANTHROPIC_API_KEY=your_claude_sk
```

### Seeding Data

Populate the database with initial problems and advisors:
```bash
npx tsx scripts/seed.ts
```

### Running the App

```bash
npm run dev
```

App will be available at [http://localhost:3000](http://localhost:3000).

## Architecture

- **Frontend/Backend:** Next.js 14 App Router
- **Database:** MongoDB via Mongoose
- **Auth:** Firebase (Client + Admin tokens)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
