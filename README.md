# Avero Landing Page

Marketing website and landing page for Avero Cloud.

**Live URL:** https://averocloud.com

## Features

- **Home** - Hero section, features overview, integrations, pricing
- **Features** - Detailed feature pages
- **Integrations** - Third-party integration showcase
- **About** - Company information
- **Login** - SSO authentication to app.averocloud.com
- **Signup** - User registration flow
- **Ava Chat** - AI assistant widget

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Custom CSS with dark theme
- **UI Components:** Konsta UI
- **Routing:** React Router
- **Analytics:** Custom tracking module

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env.local` for local development:

```env
# Optional: Ava Chat API endpoint
VITE_AVA_CHAT_ENDPOINT=https://your-api.example.com/chat
```

## Deployment

Deployed to AWS S3 + CloudFront:

```bash
npm run build
aws s3 sync dist/ s3://avero-frontend-prod --delete
aws cloudfront create-invalidation --distribution-id E1KTEOSG23NGJE --paths "/*"
```

## SSO Login Integration

The login page authenticates users and redirects to the platform:

1. User enters credentials at `/login`
2. Calls `POST https://api.averocloud.com/api/v1/auth/login`
3. On success: redirects to `https://app.averocloud.com?sso_token=xxx&sso_refresh=xxx`
4. On failure: displays error message, no redirect

```typescript
// Login flow (src/pages/LoginPage.tsx)
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

if (response.ok) {
  const data = await response.json();
  window.location.href = `https://app.averocloud.com?sso_token=${data.access_token}&sso_refresh=${data.refresh_token}`;
}
```

## Project Structure

```
src/
├── components/      # Reusable components
│   ├── Ava.tsx      # AI chat widget
│   ├── Footer.tsx   # Site footer
│   ├── Header.tsx   # Navigation header
│   └── SectionHeading.tsx
├── lib/
│   └── analytics.ts # Event tracking
├── pages/           # Route pages
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   └── ...
└── index.css        # Global styles
```

## Related Repositories

- [avero-platform](https://github.com/yah600/avero-platform) - Main application
- [avero-backend](https://github.com/yah600/avero-backend) - API services
- avero-infra - Infrastructure (Terraform)
