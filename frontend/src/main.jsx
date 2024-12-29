import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/homePage";
import ChatPage from "./routes/chatPage/chatPage";
import DashboardPage from "./routes/dashboardPage/dashboardPage";
import SignInPage from "./routes/signInPage/signInPage";
import SignUpPage from "./routes/signUpPage/signUpPage";
import RootLayout from "./layouts/rootLayout/rootLayout";
import DashboardLayout from "./layouts/dashboardLayout/dashboardLayout";

const router = createBrowserRouter([
  {
    element:<RootLayout/>,
    children:[
      {
        path:"/",
        element:<HomePage/>
      },
      {
        path:"/sign-in/*",
        element:<SignInPage/>
      },
      {
        path:"/sign-up/*",
        element:<SignUpPage/>
      },
      {
        element:<DashboardLayout/>,
        children:[
          {
            path:"/dashboard",
            element:<DashboardPage/>
          },
          {
            path:"/dashboard/chats/:id",
            element:<ChatPage/>
          }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
