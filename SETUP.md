# Quick Setup Guide

## Step-by-Step Setup

### 1. Clone/Download the Project

```bash
cd Compiler
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure Firebase

1. Create a Firebase project: https://console.firebase.google.com
2. Enable Email/Password authentication
3. Create Firestore database (test mode is fine for development)
4. Copy your Firebase config
5. Paste it into `src/firebase.js`

### 5. Start Backend (Terminal 1)

```bash
npm run server
```

You should see: `Server running on http://localhost:5000`

### 6. Start Frontend (Terminal 2)

```bash
npm run dev
```

You should see: `Local: http://localhost:3000`

### 7. Open Browser

Navigate to `http://localhost:3000`

### 8. Create Account

- Click "Sign up"
- Create an account
- You'll be redirected to the dashboard

### 9. Start Coding!

- Click on "Python Basics" category
- Select a question
- Write your code in the editor
- Click "Run Code" or press Ctrl+Enter
- Click "Submit" when all testcases pass

## Firestore Security Rules (Development)

For development, use these rules in Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Common Issues

**"Backend unavailable" message:**
- Make sure backend server is running on port 5000
- Pyodide will be used as fallback (slower but works)

**"Firebase not configured" error:**
- Check `src/firebase.js` has your Firebase config
- Make sure all fields are filled

**Python execution fails:**
- Ensure Python 3 is installed: `python3 --version`
- On Windows, you might need `python` instead of `python3`
- Update `server/server.js` line 25 if needed

**Port already in use:**
- Change port in `vite.config.js` (frontend) or `server/server.js` (backend)
- Update proxy in `vite.config.js` if backend port changes

