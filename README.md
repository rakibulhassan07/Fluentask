# Fluentask - Team Task Management System

A comprehensive team collaboration and task management platform built with React, Node.js, and MongoDB.

## Features

- **Multi-Project Support**: Manage multiple projects with dedicated Kanban boards
- **Team Collaboration**: Create teams, assign members, and track contributions
- **Real-time Task Management**: Create, update, and delete tasks with real-time updates
- **Team Analytics**: View team contribution statistics and workload distribution
- **Project-based Access Control**: Team leaders can manage tasks and team members
- **Responsive Design**: Modern UI built with Tailwind CSS and DaisyUI

## Technology Stack

### Frontend
- React 19.1.1
- Vite (Build tool)
- Tailwind CSS + DaisyUI
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications
- SweetAlert2 for confirmations

### Backend
- Node.js + Express
- MongoDB Atlas (Database)
- CORS enabled
- RESTful API design

## Project Structure (Monorepo)

```
Fluentask/
├── Backend/                 # Node.js/Express backend
│   ├── index.js            # Express server
│   ├── package.json        # Backend dependencies
│   └── ...
├── src/                    # React frontend source
│   ├── Pages/              # Main application pages
│   ├── Hook/               # Custom hooks (API clients)
│   ├── firebase/           # Firebase configuration
│   └── ...
├── public/                 # Static assets
├── dist/                   # Built frontend (production)
├── render.yaml             # Render deployment configuration
├── package.json            # Frontend dependencies and scripts
├── vite.config.js          # Vite configuration
├── DEPLOYMENT.md           # Deployment instructions
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rakibulhassan07/Fluentask.git
   cd Fluentask
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   npm run backend:install
   ```

4. **Set up environment variables**:
   ```bash
   # Copy and configure frontend environment
   cp .env.example .env
   
   # Configure backend environment
   cd Backend
   cp .env.example .env
   # Edit .env with your MongoDB credentials
   ```

### Development

**Run the full stack (recommended)**:
```bash
npm run dev:full
```

**Or run separately**:
```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Deployment

This project is configured for easy deployment on Render as a monorepo.

### Quick Deploy to Render:
1. Fork this repository
2. Connect to Render
3. Deploy as "Blueprint" (uses render.yaml)
4. Configure environment variables
5. Done!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Available Scripts

### Frontend & Full Stack
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run dev:full` - Run both frontend and backend

### Backend
- `npm run backend:install` - Install backend dependencies
- `npm run backend:dev` - Start backend in development mode
- `npm run backend:start` - Start backend in production mode

### Combined
- `npm run build:full` - Build complete application for production

## Key Features Details

### Multi-Project Kanban Boards
- Each project has its own Kanban board
- Tasks are isolated per project
- Real-time updates and task management

### Team Management
- Create teams and assign projects
- Role-based permissions (Leaders vs Members)
- Team contribution analytics with percentage breakdowns

### Task Management
- Quick inline task creation
- Drag-and-drop task organization
- Task deletion with proper permissions
- Creation time tracking

### Security & Performance
- CORS configured for production
- Environment-based configuration
- Optimized API calls with interceptors
- Error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the GitHub Issues
2. Review DEPLOYMENT.md for deployment help
3. Check backend logs in Render dashboard
