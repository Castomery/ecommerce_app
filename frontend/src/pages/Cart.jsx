import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, state, dispatch, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    const tempData = [];
    for (const items in state.cartItems) {
      for (const item in state.cartItems[items]) {
        if (state.cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: state.cartItems[items][item],
          })
        }
      }
    }
    setCartData(tempData);

  }, [state.cartItems])

  console.log(state.cartItems);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div className=''>
        {cartData.map((product, idx) => {
          const productData = products.find((p) => p._id === product._id);

          return (
            <div key={idx} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img src={productData.image[0]} alt="" className='w-16 sm:w-20' />
                <div>
                  <p className='text-sm sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{productData.price}</p>
                    <p className='px=2 sm:px-3 sm:py-1 border bg-slate-50'>Size: {product.size}</p>
                  </div>
                </div>
              </div>
              <input onChange={(e) => e.target.value === "" || e.target.value === "0" ? null : dispatch({ type: "UPDATE_CART", payload: { id: productData._id, size: product.size, quantity: Number(e.target.value) } })} type="number" min={1} value={product.quantity} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' />
              <img onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: { id: productData._id, size: product.size } })} src={assets.bin_icon} alt="bin" className='w-4 mr-4 sm:w-5 cursor-pointer' />
            </div>
          )
        })
        }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer' disabled={Object.keys(state.cartItems).length===0}>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart