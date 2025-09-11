import React from 'react'
import { Route, Routes, useRoutes } from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRoutes from './routes/AppRoutes'
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';

const App = () => {
  const routes = useRoutes(AppRoutes);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <NavBar/>
      <SearchBar/>
      {routes}
      <Footer/>
    </div>
  )
}

export default App
