import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useState } from 'react';
import axios from "axios";
import { BACKEND_URL, CURRENCY } from '../App';
import { toast } from "react-toastify";
import { useEffect } from 'react';
import { assets } from '../assets/admin_assets/assets';

const OrdersPage = () => {

  const { token } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {

    if (!token) return null;

    try {

      const res = await axios.get(BACKEND_URL + '/api/order/list', { headers: { token } });

      if (res.status === 201) {
        setOrders(res.data.orders);
      }

    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      
      const res = await axios.put(`${BACKEND_URL}/api/order/status/${orderId}`, {status: e.target.value}, {headers:{token}})

      if(res.status === 201){
        await fetchOrders();
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message)
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, idx) => (
          <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={idx}>
            <img className='w-12' src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return <p className='py-0.5' key={idx}>{item.name} x {item.quantity}<span>{item.size}</span></p>
                  } else {
                    return <p className='py-0.5' key={idx}>{item.name} x {item.quantity}<span>{item.size}</span>,</p>
                  }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ', ' + order.address.country + ', ' + order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm sm:text-size-[15px]'>Items: {order.items.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-size-[15px]'>{CURRENCY} {order.amount}</p>

            <select onChange={(e) => statusHandler(e,order._id)} value={order.status} className='p-2 font-semibold'>
              <option value="Order placed">Order placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage