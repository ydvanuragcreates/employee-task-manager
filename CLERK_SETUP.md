# Clerk Authentication Setup Guide

This guide will help you integrate Clerk authentication into the Employee & Task Management System.

## Prerequisites

1. Create a Clerk account at https://clerk.com
2. Create a new application in your Clerk dashboard

## Step 1: Get Your Clerk Credentials

### Frontend - Publishable Key

1. Go to your Clerk Dashboard
2. Navigate to **API Keys**
3. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
4. Add it to `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### Backend - Domain

1. In your Clerk Dashboard, go to **API Keys**
2. Find your **Frontend API** URL (e.g., `your-app-name-123.clerk.accounts.dev`)
3. Copy just the domain part (without `https://`)
4. Add it to `backend/.env`:

```env
CLERK_DOMAIN=your-app-name-123.clerk.accounts.dev
```

## Step 2: Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

This will install `@clerk/clerk-react` which is already added to package.json.

### Backend

```bash
cd backend
pip install -r requirements.txt
```

This will install:
- `python-jose[cryptography]` - For JWT verification
- `requests` - For fetching Clerk's JWKS

## Step 3: Configure Clerk Dashboard

### Allow localhost for development

1. Go to your Clerk Dashboard
2. Navigate to **Domains**
3. Add `http://localhost:3000` to allowed origins
4. Add `http://localhost:5173` to allowed origins (Vite default)

### Configure Session Settings (Optional)

1. Go to **Sessions** in Clerk Dashboard
2. Adjust session lifetime as needed
3. Enable/disable multi-session support

## Step 4: Start Your Application

### Start Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend will run on http://localhost:8000

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000 or http://localhost:5173

## Step 5: Test Authentication

1. Open your browser to the frontend URL
2. You should see the Clerk sign-in page
3. Sign up for a new account or sign in
4. After authentication, you'll see the dashboard
5. Try creating employees and tasks - all API calls now require authentication

## How It Works

### Frontend

- **ClerkProvider**: Wraps the entire app in `main.jsx`
- **SignedIn/SignedOut**: Conditionally renders content based on auth state
- **UserButton**: Provides user profile and sign-out functionality
- **API Interceptor**: Automatically attaches JWT token to all API requests

### Backend

- **auth.py**: Contains JWT verification logic
- **verify_clerk_token**: FastAPI dependency that validates tokens
- **Protected Routes**: All CRUD endpoints now require valid authentication

## Troubleshooting

### "Missing Clerk Publishable Key" Error

- Make sure `frontend/.env` exists and contains `VITE_CLERK_PUBLISHABLE_KEY`
- Restart the frontend dev server after adding the key

### "CLERK_DOMAIN not configured" Error

- Make sure `backend/.env` exists and contains `CLERK_DOMAIN`
- Restart the backend server after adding the domain

### "Invalid token" Errors

- Check that your CLERK_DOMAIN matches exactly what's in your Clerk dashboard
- Ensure you're using the correct publishable key for your environment (test vs production)
- Clear browser cache and sign in again

### CORS Errors

- Verify that your frontend URL is added to Clerk's allowed origins
- Check that CORS middleware in `backend/main.py` includes your frontend URL

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore` for a reason
2. **Use test keys in development** - Switch to production keys only when deploying
3. **Rotate keys regularly** - Clerk allows you to generate new keys anytime
4. **Enable MFA** - Encourage users to enable multi-factor authentication
5. **Monitor sessions** - Use Clerk dashboard to monitor active sessions

## Additional Features

### Customize Sign-In Appearance

Edit the `<SignIn />` component in `App.jsx`:

```jsx
<SignIn 
  routing="hash"
  appearance={{
    elements: {
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700'
    }
  }}
/>
```

### Add User Metadata

Access user data in your components:

```jsx
import { useUser } from '@clerk/clerk-react'

function MyComponent() {
  const { user } = useUser()
  
  return <div>Email: {user?.primaryEmailAddress?.emailAddress}</div>
}
```

### Protect Specific Routes

Use Clerk's `<RedirectToSignIn />` component for route protection.

## Support

- Clerk Documentation: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
- Project Issues: Create an issue in your repository

## Next Steps

1. Customize the sign-in/sign-up UI to match your brand
2. Add role-based access control (RBAC)
3. Implement user profile management
4. Add organization support for multi-tenant features
5. Set up webhooks for user events
