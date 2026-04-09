# Fluentask: Behavior and Feature Analysis

Fluentask is a collaborative task and team management platform built with React (Vite) on the frontend and Express + MongoDB on the backend. It is designed to support team-based work through task tracking, member management, invitations, notifications, and team chat.

## Executive Summary

Fluentask demonstrates a clear full-stack structure with practical collaboration features already implemented:

- Social login with Firebase (Google and GitHub)
- Protected routes for key work areas
- Team lifecycle management (create, update, delete)
- Invitation flow with accept/decline actions
- Notification center behavior
- Team-scoped messaging with authorization checks
- Task CRUD operations

The project is a strong foundation for a production-ready collaboration platform, with room for hardening around API-level authentication and more granular authorization.

## Product Purpose

The platform addresses common coordination pain points for teams:

- Keeping project tasks visible and actionable
- Managing team membership and communication in one place
- Improving accountability with role and activity-based flows
- Reducing friction in onboarding collaborators through invitations

## Core Behaviors

### 1. Authentication and Session Behavior

Frontend behavior:

- Users sign in via Firebase popup providers (Google, GitHub)
- On successful login, user profile data is upsert-like inserted to backend `/users`
- Existing users are handled gracefully with a welcome-back flow
- Protected pages use route guards (`PrivateRoute`) to block unauthenticated access

Observed outcome:

- UI-level access control is in place
- Sign-in UX includes feedback for common popup/auth errors

### 2. Route and Access Behavior

Public routes:

- `/`
- `/contact`
- `/login`

Protected routes:

- `/projects`
- `/tasks`
- `/team`
- `/messages`
- `/create-task`

Additional routes currently appear open (not wrapped by `PrivateRoute`):

- `/profile`
- `/settings`

Observed outcome:

- Primary collaboration workflows are protected
- Secondary account/configuration routes are reachable without route guard

### 3. Team Management Behavior

Backend behavior:

- Teams can be listed, created, updated, and deleted
- On team deletion:
	- Associated team messages are deleted
	- Team leader role can be reverted to `member`

Observed outcome:

- Team lifecycle is handled end-to-end
- Cascade-like cleanup is considered for related data

### 4. Invitation Workflow Behavior

Backend behavior:

- Invitation records can be created
- Invitees can fetch pending invitations by email
- Accepting invitation:
	- Marks invitation as accepted
	- Adds invitee to team members
	- Generates notification for inviter
- Declining invitation:
	- Marks invitation as declined
	- Generates notification for inviter

Observed outcome:

- Collaboration onboarding flow is complete and event-driven

### 5. Notification Behavior

Backend behavior:

- Users can fetch notifications by user ID
- Notifications can be marked as read (single and bulk)

Observed outcome:

- Notification model supports task/team interaction feedback loops

### 6. Team Messaging Behavior

Backend behavior:

- Team members/leaders can send and read team messages
- Authorization checks validate sender/viewer membership
- Message editing and deletion are restricted to message owner
- Edited messages are flagged with `edited` and timestamp

Observed outcome:

- Chat layer includes essential ownership and membership safeguards

### 7. Task Management Behavior

Backend behavior:

- Full task CRUD is available (`/tasks`)
- Tasks include `createdAt` and `updatedAt` metadata
- Frontend is expected to handle team-based filtering logic

Observed outcome:

- Task data model is flexible and implementation-ready for multiple UI views

## All Features In This Project

### Authentication and Access

- Firebase authentication with Google sign-in
- Firebase authentication with GitHub sign-in
- Protected route support with `PrivateRoute`
- Auth state persistence via `onAuthStateChanged`
- User onboarding to backend `/users` after successful social login

### User and Role Management

- Create user profile on first login
- Prevent duplicate users by email
- Update user role by user ID
- Update user role by user email
- Leader role assignment when creating teams
- Leader role rollback when deleting a team

### Team Management

- Create teams with project name and description
- Add members through invitation flow
- View teams created by the logged-in leader
- View teams where the logged-in user is a member
- Delete team with related data cleanup

### Invitation Workflow

- Send invitations to selected users
- Fetch pending invitations by invitee email
- Accept invitation and auto-add member to team
- Decline invitation with response status tracking
- Notify inviter after accept/decline

### Notifications

- Fetch user notifications
- Mark single notification as read
- Mark all notifications as read
- Sort notifications by latest activity

### Team Messaging

- Send team messages
- Read team-specific message history
- Edit own messages
- Delete own messages
- Authorization checks for team membership and message ownership

### Task Management

- Create tasks
- Read all tasks
- Update tasks
- Delete tasks
- Kanban status workflow (`To Do`, `In Progress`, `In Review`, `Done`)
- Created/updated timestamps for tracking

### Project and Analytics Views

- Project view derived from team and task data
- Completion stats per project
- Member and leader participation display
- Team contribution insights in task workspace

### Frontend Stack and UX

- React 19 + Vite 7 architecture
- React Router navigation
- Axios-powered API integration
- Tailwind CSS + DaisyUI UI layer
- Visual feedback via react-toastify and SweetAlert2

### Backend Stack and Data

- Express REST API
- MongoDB collections for:
	- users
	- teams
	- invitations
	- notifications
	- messages
	- tasks
- CORS + JSON middleware
- Environment-driven DB connection

## Feature Inventory

### Frontend

- React 19 + Vite 7
- React Router for navigation and protected routing
- Firebase auth integration
- Axios HTTP client via shared hook
- Tailwind CSS + DaisyUI for UI composition
- Toast and modal feedback (react-toastify, SweetAlert2)

### Backend

- Express API server
- MongoDB collections for users, teams, invitations, notifications, messages, tasks
- CORS and JSON middleware enabled
- Environment-variable-based DB configuration

## Architecture

Fluentask follows a client-server architecture with a clear separation of concerns:

- Presentation Layer (Frontend)
	- React single-page application (Vite) for UI rendering and user interaction
	- Route-based page composition for Tasks, Team, Projects, Messages, and account pages
	- Shared auth and API utilities through context and hooks
- Application Layer (Backend API)
	- Express REST endpoints implementing business rules for users, teams, tasks, invitations, notifications, and messages
	- Server-side validation for key collaboration operations (membership and ownership checks in messaging flow)
- Data Layer (Persistence)
	- MongoDB collections per domain entity (users, teams, invitations, notifications, messages, tasks)
	- Timestamped records for auditability and timeline features
- Identity Layer (Authentication)
	- Firebase Authentication used on the client
	- Authenticated user context consumed by protected routes and API calls

High-level request flow:

1. User signs in with Firebase on the frontend.
2. Frontend sends/reads domain data via Axios to Express endpoints.
3. Express applies business logic and updates MongoDB collections.
4. Updated data returns to frontend and re-renders project/team/task state.

## Project Structure

```text
Fluentask/
|-- src/
|   |-- HomePage/
|   |-- Layout/
|   |-- Pages/
|   |   |-- Contact/
|   |   |-- CreateTask/
|   |   |-- Login/
|   |   |-- Messages/
|   |   |-- Profile/
|   |   |-- Projects/
|   |   |-- Settings/
|   |   |-- Tasks/
|   |   |-- Team/
|   |-- Router/
|   |   |-- PrivateRoute.jsx
|   |   |-- Routes.jsx
|   |-- provider/
|   |   |-- AuthProvider.jsx
|   |-- Hook/
|   |   |-- useAxiosPublic.jsx
|   |-- firebase/
|   |   |-- firebase.config.js
|   |-- main.jsx
|-- Backend/
|   |-- index.js
|   |-- package.json
|-- public/
|-- package.json
|-- README.md
```

Structure responsibilities:

- src/Pages holds feature modules and page-level UI.
- src/Router centralizes route map and route protection.
- src/provider manages global auth state.
- src/Hook stores reusable integration hooks.
- Backend/index.js hosts API endpoints and MongoDB operations.

## How It Works

### 1. Authentication and Session Initialization

- User logs in with Google or GitHub through Firebase popup auth.
- Frontend creates/loads user record through the users endpoint.
- Auth state is propagated through AuthProvider.
- PrivateRoute gates protected pages based on auth state.

### 2. Team Creation and Collaboration Onboarding

- A leader creates a team and selects members.
- Invitations are generated for selected users.
- Invitees accept or decline from invitation workflow.
- On accept, the user is added to the team and notifications are created.

### 3. Task and Project Execution

- Tasks are created and updated against project/team context.
- Task status moves across Kanban stages: To Do, In Progress, In Review, Done.
- Project views aggregate team membership and task completion metrics.

### 4. Communication and Activity Awareness

- Team members exchange messages in team-scoped chat.
- Ownership rules allow users to edit/delete only their own messages.
- Notification endpoints keep users informed of invitation and team events.

### 5. UI Synchronization Pattern

- Pages fetch data from API endpoints using Axios.
- Backend persists changes to MongoDB.
- Updated API responses refresh local UI state and metrics.

## Strengths

- Practical and coherent feature set for team collaboration
- Good separation between frontend UI and backend resources
- Important collaborative workflows are already wired
- User feedback patterns are considered in auth and actions

## Improvement Opportunities

1. Add API authentication middleware:
- Backend endpoints currently rely mostly on client context and request payloads
- JWT/Firebase token verification on protected API routes would harden security

2. Enforce stricter authorization per resource:
- Ensure task/team operations validate ownership or team membership server-side

3. Standardize roles and naming conventions:
- Role values currently vary (`User`, `user`, `member`)
- A normalized role model will reduce policy inconsistencies

4. Improve route-guard consistency:
- Consider protecting profile/settings routes if required by product policy

5. Add automated tests:
- Unit tests for service logic and integration tests for API behavior are currently missing

## Local Development Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas connection
- Firebase project credentials

### Run On Local PC (Step-by-Step)

1. Clone the repository and open it in VS Code.
2. Open two terminals: one for frontend root, one for backend folder.
3. Install frontend dependencies from project root:

```bash
npm install
```

4. Install backend dependencies:

```bash
cd Backend
npm install
```

5. Create backend environment file at `Backend/.env`:

```env
DB_USER=your_mongodb_user
DB_PASSWORD=your_mongodb_password
PORT=5000
```

6. Start backend server (inside `Backend`):

```bash
npm run dev
```

7. Start frontend app (from project root in another terminal):

```bash
npm run dev
```

8. Open the app in browser (default Vite URL):

- `http://localhost:5173`

9. Verify backend is running:

- `http://localhost:5000/`

### Firebase Setup Note

- Current Firebase configuration is inside `src/firebase/firebase.config.js`.
- You can use the existing config for this project, or replace it with your own Firebase project config for personal deployment/testing.

## Project Positioning

Fluentask is positioned as a collaborative productivity platform with the right baseline feature set for internal team workflows and growth into a production-grade SaaS product. The current implementation already supports meaningful daily use and can be elevated further through security hardening, policy consistency, and automated quality gates.
