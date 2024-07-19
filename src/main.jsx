import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SignupForm from './components/SignupForm.jsx'
import LoginForm from './components/LoginForm.jsx'
import HomePage from './components/HomePage.jsx'
import AdminLoginForm from './components/AdminLogin.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/user/signup",
    element: <SignupForm/>
  },
  {
    path:"/user/login",
    element:<LoginForm/>
  },
  {
    path:"/home",
    element:<HomePage/>
  },
  {
    path:"/admin/login",
    element:<AdminLoginForm/>
  },
  {
    path:"/admin/dashboard",
    element:<AdminDashboard/>
  }
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router} />
  
)
