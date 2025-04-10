import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import Root from './routes/root.tsx';
import Home, {loader as PostLoader} from './routes/home.tsx';
import Login from './routes/login.tsx';
import Profil, {loader as UserLoader} from './routes/profil.tsx';
import OtherProfil, {loader as OtherUserLoader} from './routes/otherProfil.tsx';
import Signup from './routes/signup.tsx';

import './index.css';


const router = createBrowserRouter([
  {
    path: import.meta.env.BASE_URL,
    element: <Root />,
    children: [
      {
        path: import.meta.env.BASE_URL,
        element: <Home />,
        loader: PostLoader, 
      },
      {
        path: `${import.meta.env.BASE_URL}login`,
        element: <Login />,
      },
      {
        path: `${import.meta.env.BASE_URL}signup`,
        element: <Signup />,
      },
      {
        path: `${import.meta.env.BASE_URL}profile`,
        element: <Profil />,
        loader: UserLoader,
      },
      {
        path : `${import.meta.env.BASE_URL}otherProfil/:id`,
        element: <OtherProfil />,
        loader: OtherUserLoader,
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
