import React, { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'
import { useRoutes } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes";
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './context/AuthContext';

// eslint-disable-next-line react-refresh/only-export-components
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const CURRENCY = "$";

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const routes = useRoutes(AppRoutes);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === '' ? <Login setToken={setToken} /> :
        <>
          <AuthContext.Provider value={{ token, setToken }}>
            <NavBar/>
            <hr />
            <div className='flex w-full'>
              <SideBar />
              <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                {routes}
              </div>
            </div>
          </AuthContext.Provider>
        </>
      }
    </div>
  )
}

export default App