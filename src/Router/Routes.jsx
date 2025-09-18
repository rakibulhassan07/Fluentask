import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Main from "../Layout/Main";
import HomePage from "../HomePage/HomePage";
import Contact from "../Pages/Contact/Contact";
import Login from "../Pages/Login/Login";
import Projects from "../Pages/Projects/Projects";
import Tasks from "../Pages/Tasks/Tasks";
import Team from "../Pages/Team/Team";
import Messages from "../Pages/Messages/Messages";
import Profile from "../Pages/Profile/Profile";
import Settings from "../Pages/Settings/Settings";
import CreateTask from "../Pages/CreateTask/CreateTask";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <HomePage></HomePage>,
      },
      {
        path: "/contact",
        element: <Contact></Contact>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      
      {
        path: "/projects",
        element: (
          <PrivateRoute>
            <Projects></Projects>
          </PrivateRoute>
        ),
      },
      {
        path: "/tasks",
        element:(
          <PrivateRoute>
            <Tasks></Tasks>
          </PrivateRoute>
        ),
      },
      {
        path: "/team",
        element: (
          <PrivateRoute>
            <Team></Team>
          </PrivateRoute>
        ),
      },
      {
        path: "/messages",
        element: (
          <PrivateRoute>
            <Messages></Messages>
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/settings",
        element: <Settings></Settings>,
      },
      {
        path: "/create-task",
        element: (
          <PrivateRoute>
            <CreateTask></CreateTask>
          </PrivateRoute>
        ),
      }
    
    ],
  },
]);