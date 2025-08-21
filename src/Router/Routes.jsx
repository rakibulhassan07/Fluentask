import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Main from "../Layout/Main";
import HomePage from "../HomePage/HomePage";
import Contact from "../Pages/Contact/Contact";

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
    
    ],
  },
]);