import React, { useContext, useReducer, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { assets } from '../assets/admin_assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL } from '../App';

const initialState = {
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    bestseller: false,
    sizes: [],
    images: [],
}

function reducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'TOGGLE_SIZE':
            return {
                ...state,
                sizes: state.sizes.includes(action.size)
                    ? state.sizes.filter(s => s !== action.size)
                    : [...state.sizes, action.size],
            };
        case 'SET_IMAGES':
            return { ...state, images: action.images };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

const AddPage = () => {

    // const [images, setImages] = useState([]);

    // const [name, setName] = useState("")
    // const [description, setDescription] = useState("");
    // const [price, setPrice] = useState("");
    // const [category, setCategory] = useState("Men");
    // const [subCategory, setSubCategory] = useState("Topwear");
    // const [bestseller, setBestseller] = useState(false);
    // const [sizes, setSizes] = useState([]);

    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);

    const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files);
        dispatch({ type: 'SET_IMAGES', images: files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (state.images.length === 0)
            return toast.error('Please upload at least one image');

        const formData = new FormData();
        Object.entries(state).forEach(([key, value]) => {
            if (key === 'images') {
                value.forEach((file) => formData.append('images', file));
            } else if (key === 'sizes') {
                formData.append('sizes', JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });

        try {
            setLoading(true);
            const res = await axios.post(BACKEND_URL + "/api/product/add", formData, { headers: { token } });
            
            if(res.status === 201){
                toast.success(res.data.message);
            }
            else{
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
            dispatch({type:"RESET"});
        }


    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3'>

            <div>
                {/* Image upload */}
                <div>
                    <p className='mb-2'>Upload Image</p>

                    <div className='flex gap-2'>
                        <label htmlFor="images">
                            <img className='w-40' src={assets.upload_area} alt="" />
                            <input onChange={handleFilesChange} type="file" id="images" multiple accept='image/3' hidden />
                        </label>
                    </div>
                </div>
                {/* Preview */}
                <div className='flex gap-2 mt-2'>
                    {state.images.map((file, idx) => (
                        <img key={idx} src={URL.createObjectURL(file)} alt={`preview-${idx}`} className='w-20 h-20 object-cover' />
                    ))}

                </div>
            </div>

            <div className='w-full'>
                <p className='mb-2'>Produc Name</p>
                <input onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
                    className='w-full max-w-[500px] px-3 py-2'
                    type="text"
                    placeholder='Type here'
                    required />
            </div>

            <div className='w-full'>
                <p className='mb-2'>Produc description</p>
                <textarea onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
                    className='w-full max-w-[500px] px-3 py-2'
                    type="text"
                    placeholder='Write description here'
                    required />
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                <div>
                    <p className='mb-2'>Produc category</p>
                    <select onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'category', value: e.target.value })} className='w-full px-3 py-2'>
                        <option value={"Men"}>Men</option>
                        <option value={"Women"}>Women</option>
                        <option value={"Kids"}>Kids</option>
                    </select>
                </div>

                <div>
                    <p className='mb-2'>Sub category</p>
                    <select onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'subCategory', value: e.target.value })} className='w-full px-3 py-2'>
                        <option value={"Topwear"}>Topwear</option>
                        <option value={"Bottomwear"}>Bottomwear</option>
                        <option value={"Winterwear"}>Winterwear</option>
                    </select>
                </div>

                <div>
                    <p className='mb-2'>Product price</p>
                    <input onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'price', value: e.target.value })}
                        className='w-full px-3 py-2 sm:w-[120px]'
                        type="number"
                        placeholder='eg. 25' />
                </div>
            </div>

            <div>
                <p className='mb-2'>Produc sizes</p>
                <div className='flex gap-3'>
                    {sizeOptions.map((size) => (
                        <div key={size} onClick={() => dispatch({ type: 'TOGGLE_SIZE', size })}>
                            <p
                                className={`px-3 py-1 cursor-pointer ${state.sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'
                                    }`}
                            >
                                {size}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex gap-2 mt-2'>
                <input onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'bestseller', value: e.target.checked })}
                    checked={state.bestseller}
                    type="checkbox"
                    id="bestseller" />
                <label className='cursor-pointer' htmlFor='bestseller'>Add to bestseller</label>
            </div>

            <button className='w-28 py-3 mt-4 bg-black text-white' type="submit" disabled={loading}>{loading ? 'Adding...' : "ADD"}</button>
        </form>
    )
}

export default AddPage