/* eslint-disable no-case-declarations */
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const initialState = (products) => ({
    filterProducts: products || [],
    category: [],
    subCategory: [],
    sortBy: "relavent",
    search: "",
  })

  function filterReducer(state, action) {
    switch (action.type) {

      case "SET_CATEGORY":
        const categories = state.category.includes(action.payload)
          ? state.category.filter(c => c !== action.payload)
          : [...state.category, action.payload];
        return { ...state, category: categories };

      case "SET_SUBCATEGORY":
        const subCategories = state.subCategory.includes(action.payload)
          ? state.subCategory.filter(c => c !== action.payload)
          : [...state.subCategory, action.payload];
        return { ...state, subCategory: subCategories };

      case "SET_SORT":
        return {...state, sortBy: action.payload};

      case "SET_SEARCH":
        return {...state, search: action.payload};

      case "APPLY_FILTER":
        let filtered = action.products;
        if (state.category.length) {
          filtered = filtered.filter(p => state.category.includes(p.category));
        }
        if (state.subCategory.length) {
          filtered = filtered.filter(p => state.subCategory.includes(p.subCategory))
        }
        
        {/* Sort */}
        if(state.sortBy === 'low-high'){
          filtered = filtered.sort((p1,p2) => p1.price - p2.price);
        }else if(state.sortBy === 'high-low'){
          filtered = filtered.sort((p1,p2) => p2.price - p1.price);
        }

        {/* Search */}
        if(state.search){
          filtered = filtered.filter(p => p.name.toLowerCase().includes(state.search.toLowerCase()));
        }

        return { ...state, filterProducts: filtered };
      
        default:
        return state;
    }
  }

const Collection = () => {

  const { products, state} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);

  const [collectionState, dispatch] = useReducer(filterReducer, initialState(products));

  const toggleFilter = (type, value) => {
    dispatch({ type: type, payload: value });
  };

  const handleSortChange = (e) => {
    dispatch({type: "SET_SORT", payload: e.target.value});
  }

  useEffect(() => {
    dispatch({type: "SET_SEARCH" , payload:state.search});
    dispatch({ type: "APPLY_FILTER", products });

  }, [collectionState.category, collectionState.subCategory, collectionState.sortBy, products, state.search, state.showSearch])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/*Filter*/}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img src={assets.dropdown_icon} alt='' className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} />
        </p>
        {/* Category */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type='checkbox' className='w-3' value={"Men"} onChange={() => toggleFilter("SET_CATEGORY", "Men")} /> Men
            </p>
            <p className='flex gap-2'>
              <input type='checkbox' className='w-3' value={"Women"} onChange={() => toggleFilter("SET_CATEGORY", "Women")} /> Women
            </p>
            <p className='flex gap-2'>
              <input type='checkbox' className='w-3' value={"Kids"} onChange={() => toggleFilter("SET_CATEGORY", "Kids")} /> Kids
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Type</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input type='checkbox' className='w-3' value={"Topwear"} onChange={() => toggleFilter("SET_SUBCATEGORY", "Topwear")} /> Topwear
            </p>
            <p className='flex gap-2'>
              <input type='checkbox' className='w-3' value={"Bottomwear"} onChange={() => toggleFilter("SET_SUBCATEGORY", "Bottomwear")} /> Bottomwear
            </p>
            <p className='flex gap-2'>
              <input type='checkbox' className='w-3' value={"Winterwear"} onChange={() => toggleFilter("SET_SUBCATEGORY", "Winterwear")} /> Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select className='border-2 border-gray-300 text-sm px-2' value={collectionState.sortBy} onChange={handleSortChange}>
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {collectionState.filterProducts.map((product, idx) => (
            <ProductItem key={idx} id={product._id} img={product.image} name={product.name} price={product.price} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Collection