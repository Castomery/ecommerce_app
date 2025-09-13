import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {useSearchParams} from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const Verify = () => {

    const {navigate, token, clearCartHandler, backendUrl} = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId')
    
    const verifyPayment = async() => {

        try {
            
            if(!token) return null;

            const res = await axios.post(backendUrl+'/api/order/verifyStripe', {success, orderId}, {headers:{token}});

            if(res.status === 201){
                clearCartHandler()
                navigate('/orders');
            }else{
                navigate('/cart');
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        verifyPayment();
    },[token])

  return (
    <div>Verify</div>
  )
}

export default Verify