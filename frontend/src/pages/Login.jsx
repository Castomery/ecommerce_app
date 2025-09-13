import React, { useContext, useEffect, useReducer, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import {toast} from "react-toastify";

const initialState = {
  name: "",
  email: "",
  password: "",
}

function loginReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const handleChange = (e) => {
    dispatch({
      type: "SET_FIELD",
      payload: {
        field: e.target.name,
        value: e.target.value,
      },
    });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    try {

      if(currentState === "Sign Up"){

        const res = await axios.post(backendUrl+"/api/user/register",{name:state.name, email:state.email, password:state.password});

        if(res.status === 201){
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        }

      }else{

        const res = await axios.post(backendUrl+"/api/user/login",{email:state.email, password:state.password});

        if(res.status === 201){
          setToken(res.data.token)
          localStorage.setItem('token', res.data.token);
        }
      }

    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <form onSubmit={handleOnSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState === "Sign Up" && <input onChange={handleChange} name="name" value={state.name} type="text" placeholder='Name' className='w-full px-3 py-2 border border-gray-800' required />}
      <input onChange={handleChange} name="email" value={state.email} type="email" placeholder='Email' className='w-full px-3 py-2 border border-gray-800' required />
      <input onChange={handleChange} name="password" value={state.password} type="password" placeholder='Password' className='w-full px-3 py-2 border border-gray-800' required />

      <div className='w-full flex justify-between text-md mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {currentState === "Login" ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p> : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>}
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === "Login" ? "Sign In" : "Sign Up"}</button>
    </form>
  )
}

export default Login