import axios from 'axios';
import React, { useState } from 'react'
import {BACKEND_URL} from '../App';
import {toast} from "react-toastify";


const Login = ({setToken}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOnSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await axios.post(BACKEND_URL+'/api/user/admin', {email,password})
            
            if(res.status === 201){
                setToken(res.data.token);
            }else{
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-gray-300'>
        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
            <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
            <form onSubmit={handleOnSubmit}>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounden-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com' required />
                </div>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounden-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter your password' required />
                </div>
                <button type="submit" className='mt-2 w-full py-2 px-4 rounden-md text-white bg-black'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login