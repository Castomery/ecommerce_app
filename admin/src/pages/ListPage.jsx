import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { BACKEND_URL, CURRENCY } from '../App';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ListPage = () => {

    const [list, setList] = useState([]);
    const {token} = useContext(AuthContext);

    const fetchProductsList = async () => {
        try {
            const res = await axios.get(BACKEND_URL+"/api/product/list")

            if(res.status === 201){
                setList(res.data.products);
            }else{
                toast.error(res.data.message);
            }


        } catch (error) {
            console.log(error.message);
        }
    }

    const deleteProduct = async (id) => {

        try {
            const res = await axios.delete(BACKEND_URL+`/api/product/remove/${id}`,{headers:{token}});

            if(res.status === 201){
                toast.success(res.data.message,{autoClose:500});
                await fetchProductsList();
            }else{
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error.message);
        }

    }

    useEffect(() => {
        fetchProductsList();
    }, [])

    return (
        <>
            <p className='mb-2'>All Products List</p>
            <div className='flex flex-col gap-2'>

                {/* List table Title */}
                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className='text-center'>Action</b>
                </div>

                {/* Product List */}
                {list.map((p, idx) => (
                    <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={idx}>
                        <img className='w-12' src={p.image[0]} alt="" />
                        <p>{p.name}</p>
                        <p>{p.category}</p>
                        <p>{CURRENCY} {p.price}</p>
                        <p onClick={() => deleteProduct(p._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
                    </div>
                ))}

            </div>
        </>
    )
}

export default ListPage