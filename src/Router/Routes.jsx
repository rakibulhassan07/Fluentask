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
import Profile from "../Pages/Profile/Profile";
import Settings from "../Pages/Settings/Settings";
import CreateTask from "../Pages/CreateTask/CreateTask";

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
        element: <Projects></Projects>,
      },
      {
        path: "/tasks",
        element: <Tasks></Tasks>,
      },
      {
        path: "/team",
        element: <Team></Team>,
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
        element: <CreateTask></CreateTask>,
      }
    
    ],
  },
]);