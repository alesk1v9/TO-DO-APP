import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// createBrowserRouter is being used to specify which component will be render for each URL
// RouterProvider will enable the router to be used in the app
import App from './App.jsx'
import './index.css'

import Login from "./pages/login.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";

// create a router object with route definitions
const router = createBrowserRouter([
  {
    path: '/', // base path
    element: <App />, // component to render for the base path
    children: [ // nested routes
      {
        index: true, // default route
        element: <Home />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: 'signup',
        element: <Signup />
      }
    ]
  },
]);


// Render the application, providing the router object to enable routing
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} /> // provide router to the app
);
