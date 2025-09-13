import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { navigate, backendUrl, token, state, clearCartHandler, cartAmount, delivery_fee, products } = useContext(ShopContext);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData(data => ({ ...data, [name]: value }));
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {

      let orderItems = [];
      for (const items in state.cartItems) {
        for (const item in state.cartItems[items]) {
          if (state.cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = state.cartItems[items][item]
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: cartAmount + delivery_fee,
      }

      switch (paymentMethod) {
        case 'cod': {
          const res = await axios.post(backendUrl + '/api/order/cod', orderData, { headers: { token } });
          if (res.status === 201) {
            clearCartHandler();
            navigate('/orders');
          } else {
            toast.error(res.data.message);
          }
          break;
        }
        case 'stripe':{
           const res = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers: {token}})

           if(res.status === 201){
            const {session_url} = res.data;
            window.location.replace(session_url);
           }
          break;
        }

        default:
          break;
      }

    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message);
    }

  }

  return (
    <form onSubmit={handleOnSubmit} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstname} type="text" placeholder='First name' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last name' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />

        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='Email address' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />
        </div>

        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="text" placeholder='Zipcode' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="text" placeholder='Phone number' className='border border-gray-33 rounded py-1.5 px-3.5 w-full' />
      </div>

      {/* Right */}

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* Payment Methods */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setPaymentMethod("stripe")} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.stripe_logo} alt="" className='h-5 mx-4' />
            </div>
            <div onClick={() => setPaymentMethod("cod")} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='cursor-pointer bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder