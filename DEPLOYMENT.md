# Fluentask Deployment Guide - Monorepo on Render

## Overview
This guide helps you deploy the complete Fluentask application (frontend + backend) as a monorepo on Render using the included `render.yaml` configuration file.

## Prerequisites
1. GitHub repository with your Fluentask code
2. Render account (free tier works)
3. MongoDB Atlas database (get connection credentials)

## Automatic Deployment (Recommended)

### Step 1: Connect Repository to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository containing the Fluentask project
4. Render will automatically detect the `render.yaml` file

### Step 2: Configure Environment Variables
Render will create two services automatically:
- `fluentask-backend` (Web Service)
- `fluentask-frontend` (Static Site)

**For Backend Service, set these environment variables:**
```
NODE_ENV=production
DB_USER=FluentaskUser
DB_PASSWORD=OszVoSMx7dugmeaV
PORT=10000
```

**For Frontend Service:**
The `VITE_API_URL` will be automatically set to point to your backend service.

### Step 3: Deploy
1. Click "Apply" to start the deployment
2. Render will build and deploy both services
3. The frontend will automatically get the correct backend URL

## Manual Deployment (Alternative)

If you prefer to deploy services separately:

### Backend Service:
1. New → Web Service
2. Root Directory: `Backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables: (same as above)

### Frontend Service:
1. New → Static Site
2. Root Directory: `/` (root)
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-service-url.onrender.com
   ```

## Environment Configuration

### Database Setup (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Create database user: `FluentaskUser`
3. Get connection string
4. Update environment variables with your credentials

### CORS Configuration
The backend is pre-configured to accept requests from:
- Development: `http://localhost:5173`
- Production: Automatically configured for Render deployment

## Development Commands

```bash
# Install all dependencies
npm install

# Install backend dependencies
npm run backend:install

# Run full stack in development
npm run dev:full

# Run frontend only
npm run dev

# Run backend only
npm run backend:dev

# Build for production
npm run build

# Build full stack
npm run build:full
```

## Deployment URLs
After successful deployment:
- **Frontend**: `https://fluentask-frontend.onrender.com`
- **Backend API**: `https://fluentask-backend.onrender.com`
- **Health Check**: `https://fluentask-backend.onrender.com/health`

## Troubleshooting

### Common Issues:
1. **Build fails**: Check that all dependencies are listed in package.json
2. **CORS errors**: Verify the backend CORS configuration includes your frontend URL
3. **API connection fails**: Check that VITE_API_URL points to the correct backend URL
4. **Database connection fails**: Verify MongoDB Atlas credentials and IP whitelist

### Debug Steps:
1. Check Render logs for both services
2. Test backend health endpoint: `/health`
3. Verify environment variables are set correctly
4. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

## File Structure
```
Fluentask/
├── render.yaml          # Render deployment configuration
├── package.json         # Frontend dependencies and scripts
├── vite.config.js       # Vite configuration
├── .env.example         # Environment variables template
├── Backend/
│   ├── package.json     # Backend dependencies
│   ├── index.js         # Express server
│   └── ...
├── src/                 # React frontend source
└── dist/               # Built frontend (created during build)
```

## Support
If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection

Your app will be live at: `https://your-frontend-name.onrender.com`