import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import Root from './routes/root.tsx';
import Home, {loader as PostLoader} from './routes/home.tsx';
import Login from './routes/login.tsx';
import Profil from './routes/profil.tsx';
import Signup from './routes/signup.tsx';

import './index.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />,
        loader: PostLoader, 
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/profile',
        element: <Profil />,
      }
    ]
    
  },
  
]);

const rootElement = document.querySelector('#root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
} else {
  console.error('No root element found');
}
