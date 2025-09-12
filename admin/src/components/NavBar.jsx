import React, { useContext } from 'react'
import { assets } from '../assets/admin_assets/assets.js';
import { AuthContext } from '../context/AuthContext.jsx';

const NavBar = () => {

    const { setToken } = useContext(AuthContext);



    return (
        <div className='flex items-center py-2 px-[4%] justify-between'>
            <img src={assets.logo} alt="" className='w-[max(20%,100px)]' />
            <button onClick={() => setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full'>Logout</button>
        </div>
    )
}

export default NavBar