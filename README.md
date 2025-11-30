# Python Learning IDE

A full-stack interactive coding learning platform similar to LeetCode + Codecademy for Python basics & DSA.

## Tech Stack

- **Frontend**: React + Vite, Material UI v6, Monaco Editor, Framer Motion
- **Backend**: Node.js + Express (Python code execution)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Hosting**: Firebase Hosting
- **Fallback**: Pyodide (for client-side Python execution when backend is unavailable)

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python 3.x
- npm or yarn
- Firebase account

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Sign-in method** → **Email/Password**
4. Create a **Firestore Database** (start in test mode for development)
5. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll down to "Your apps" → Web app
   - Copy the `firebaseConfig` object
6. Update `src/firebase.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 3. Run Backend Server

Open a terminal and run:

```bash
npm run server
```

Or:

```bash
cd server
node server.js
```

The backend runs on `http://localhost:5000`

**Note**: Make sure Python 3 is installed and accessible as `python3` in your PATH.

### 4. Run Frontend

Open another terminal and run:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`

### 5. Access the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account or login
3. Start solving problems!

## Project Structure

```
project-root/
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main app component with routing
│   ├── firebase.js           # Firebase configuration
│   ├── routes/
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── Dashboard.jsx     # Category dashboard
│   │   ├── CategoryPage.jsx  # Questions in a category
│   │   └── QuestionPage.jsx  # Individual question page
│   ├── components/
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── CategoryCard.jsx  # Category display card
│   │   ├── QuestionCard.jsx  # Question display card
│   │   ├── CodeEditor.jsx    # Monaco editor wrapper
│   │   └── TestcaseResult.jsx # Testcase results display
│   └── data/
│       └── questions.js      # 50 questions data
├── server/
│   ├── server.js             # Express backend server
│   ├── runner.py            # Python code executor
│   └── package.json         # Backend dependencies
├── public/                   # Static assets
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuration
└── firebase.json            # Firebase hosting config
```

## Features

- 🔐 **Email/Password Authentication** - Secure user accounts
- 📚 **5 Categories with 50+ Questions** - Progressive learning path
- 🔒 **Progressive Unlocking System** - Complete categories to unlock next
- 💾 **Code Auto-save** - Your code is saved automatically
- 🧪 **Testcase Execution** - Run code against multiple testcases
- 🎉 **Confetti Animations** - Celebrate when you complete categories
- 📊 **Progress Tracking** - Track your progress in Firestore
- ⌨️ **Keyboard Shortcuts** - Ctrl+Enter to run code
- 🎨 **Dark Theme** - Beautiful dark UI with Material UI
- 🔄 **Pyodide Fallback** - Works even when backend is down

## Categories

1. **Basics** (20 questions) - Unlocked by default
   - Hello World, Arithmetic, Conditionals, Loops, Functions
2. **Lists** (7 questions) - Unlocks after Basics
   - List operations, Sorting, Searching
3. **Strings** (6 questions) - Unlocks after Lists
   - String manipulation, Palindromes, Pattern matching
4. **OOP** (5 questions) - Unlocks after Strings
   - Classes, Inheritance, Methods
5. **DSA** (10 questions) - Unlocks after OOP
   - Algorithms, Data structures, Problem solving

## Development

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Deploying to Firebase Hosting

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Build the project
npm run build

# Deploy
firebase deploy
```

## Backend Details

The backend server (`server/server.js`) handles Python code execution:

- Receives code and testcases via POST `/api/run`
- Executes code with timeout (2 seconds)
- Returns testcase results
- Uses `runner.py` to safely execute Python code

**Security Note**: For production, consider:
- Adding rate limiting
- Using Docker containers for code execution
- Implementing proper sandboxing
- Adding input validation

## Troubleshooting

### Backend not starting
- Check if Python 3 is installed: `python3 --version`
- Make sure port 5000 is not in use
- Check server logs for errors

### Firebase connection issues
- Verify Firebase config in `src/firebase.js`
- Check Firestore rules allow read/write for authenticated users
- Ensure Authentication is enabled

### Pyodide fallback not working
- Pyodide loads in the browser, may take time on first load
- Check browser console for errors
- Backend execution is preferred and faster

## License

MIT License - feel free to use this project for learning and development!

