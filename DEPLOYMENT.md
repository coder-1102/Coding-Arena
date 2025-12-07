# Deployment Guide

## SQL Execution

**SQL queries now run entirely in the browser using sql.js (SQLite compiled to WebAssembly).** No backend is required for SQL execution - it works out of the box on Vercel!

## Backend Deployment (Python Only)

The backend server is only needed for **Python code execution**. SQL execution works without any backend. Here are recommended options for Python backend:

### Option 1: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add a new service and select "Empty Service"
5. In the service settings:
   - Set the root directory to `server`
   - Set the start command to: `node server.js`
   - Add environment variables if needed
6. Railway will provide a URL like: `https://your-app.railway.app`
7. Copy this URL for the frontend environment variable

### Option 2: Render
1. Go to [Render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `node server.js`
   - Root Directory: `server`
5. Render will provide a URL like: `https://your-app.onrender.com`

### Option 3: Fly.io
1. Install Fly CLI: `flyctl auth login`
2. In the `server` directory, run: `fly launch`
3. Follow the prompts
4. Deploy: `fly deploy`

## Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. **For Python execution only**: In project settings, add environment variable (optional):
   - **Name**: `VITE_API_URL`
   - **Value**: Your deployed backend URL (e.g., `https://your-app.railway.app`)
   - **Note**: SQL execution works without this - it runs in the browser!
4. Redeploy the application

**SQL queries will work immediately without any backend setup!**

## Local Development

Create a `.env.local` file in the root directory:

```
VITE_API_URL=http://localhost:5000
```

Then run:
- Frontend: `npm run dev`
- Backend: `npm run server` (in the root) or `node server/server.js`

## Notes

- **SQL Execution**: Runs entirely in the browser using sql.js - no backend needed!
- **Python Execution**: Requires backend deployment (Railway, Render, etc.)
- The backend must be publicly accessible (not localhost) for Python execution
- CORS is enabled on the backend to allow requests from your frontend domain
- Make sure Python 3 is installed on your backend hosting service
- SQLite is used in-memory in the browser, so no database setup is required

