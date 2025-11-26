# Quick Start - Clerk Authentication

## 🚀 5-Minute Setup

### Step 1: Get Clerk Credentials (2 min)

1. Go to https://clerk.com and sign up
2. Create a new application
3. Copy your **Publishable Key** from API Keys section
4. Copy your **Domain** from Frontend API URL

### Step 2: Configure Frontend (1 min)

Create `frontend/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_paste_your_key_here
```

### Step 3: Configure Backend (1 min)

Update `backend/.env`:
```env
CLERK_DOMAIN=your-domain.clerk.accounts.dev
```

### Step 4: Install & Run (1 min)

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Step 5: Test

1. Open http://localhost:3000
2. Sign up/Sign in
3. Access dashboard ✅

---

## 📋 Commands Cheat Sheet

### Install Dependencies

```bash
# Frontend
npm install @clerk/clerk-react

# Backend
pip install python-jose[cryptography] requests
```

### Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

**Backend** (`backend/.env`):
```
CLERK_DOMAIN=your-app.clerk.accounts.dev
OPENAI_API_KEY=sk-...
```

### Start Servers

```bash
# Backend (Terminal 1)
cd backend
uvicorn main:app --reload

# Frontend (Terminal 2)
cd frontend
npm run dev
```

---

## 🔍 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| "Missing Clerk Publishable Key" | Add key to `frontend/.env` and restart |
| "CLERK_DOMAIN not configured" | Add domain to `backend/.env` and restart |
| "Invalid token" | Check domain matches Clerk dashboard exactly |
| CORS errors | Add `http://localhost:3000` to Clerk allowed origins |

---

## 📚 Full Documentation

- Detailed setup: [CLERK_SETUP.md](CLERK_SETUP.md)
- Implementation details: [AUTHENTICATION_IMPLEMENTATION.md](AUTHENTICATION_IMPLEMENTATION.md)
- Main README: [README.md](README.md)

---

## ✅ What's Protected

All these endpoints now require authentication:

- ✅ Employee CRUD operations
- ✅ Task CRUD operations  
- ✅ AI task description generation

---

## 🎯 Key Files Modified

**Frontend:**
- `src/main.jsx` - ClerkProvider wrapper
- `src/App.jsx` - Sign-in UI & UserButton
- `src/api/api.js` - Token interceptor

**Backend:**
- `auth.py` - JWT verification (NEW)
- `routers/employees.py` - Protected endpoints
- `routers/tasks.py` - Protected endpoints

---

**Need help?** See [CLERK_SETUP.md](CLERK_SETUP.md) for detailed instructions.
