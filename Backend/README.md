# Fluentask Backend

## Environment Variables Required on Render:

- `DB_USER`: Your MongoDB Atlas username
- `DB_PASSWORD`: Your MongoDB Atlas password
- `NODE_ENV`: production
- `PORT`: 10000 (automatically set by Render)

## Deployment Steps:

1. Connect this repository to Render
2. Select "Backend" folder as root directory
3. Set environment variables in Render dashboard
4. Deploy!

## Local Development:

```bash
npm install
npm run dev  # Uses nodemon for development
npm start    # Production start command
```