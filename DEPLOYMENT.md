# Deployment Instructions for Render

## Backend Deployment Steps:

1. **Create Web Service**:
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - **Root Directory**: `Backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

2. **Set Environment Variables**:
   ```
   NODE_ENV=production
   DB_USER=FluentaskUser
   DB_PASSWORD=OszVoSMx7dugmeaV
   PORT=10000
   ```

3. **Note your backend URL**: `https://your-backend-name.onrender.com`

## Frontend Deployment Steps:

1. **Create Static Site**:
   - Go to Render dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - **Root Directory**: `/` (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

2. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

3. **Update Backend CORS** (Important!):
   - After frontend deployment, update the CORS origin in `Backend/index.js`
   - Replace `https://fluentask-frontend.onrender.com` with your actual frontend URL

## Final Steps:

1. Deploy backend first
2. Note the backend URL
3. Deploy frontend with correct VITE_API_URL
4. Update CORS in backend with frontend URL
5. Test the connection

Your app will be live at: `https://your-frontend-name.onrender.com`