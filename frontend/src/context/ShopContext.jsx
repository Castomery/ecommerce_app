/* eslint-disable no-case-declarations */
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const initialState = {
    cartItems: {},
    search: "",
    showSearch: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "ADD_TO_CART": {
            const { id, size } = action.payload;

            return {
                ...state,
                cartItems: {
                    ...state.cartItems,
                    [id]: {
                        ...(state.cartItems[id] || {}),
                        [size]: (state.cartItems[id]?.[size] || 0) + 1,
                    },
                },
            };
        }

        case "UPDATE_CART": {
            const { id, size, quantity } = action.payload;
            if (quantity <= 0) return state; // optionally ignore or remove

            return {
                ...state,
                cartItems: {
                    ...state.cartItems,
                    [id]: {
                        ...(state.cartItems[id] || {}),
                        [size]: quantity,
                    },
                },
            };
        }

        case "REMOVE_FROM_CART": {

            const { id, size } = action.payload;
            const updatedCart = { ...state.cartItems };

            if (updatedCart[id]?.[size]) {
                delete updatedCart[id][size];
                if (Object.keys(updatedCart[id]).length === 0) delete updatedCart[id];
            }

            return { ...state, cartItems: updatedCart };
        }

        case "CLEAR_CART":
            return { ...state, cartItems: {} };

        case "SET_SEARCH":
            return { ...state, search: action.payload };

        case "SET_SHOW_SEARCH":
            return { ...state, showSearch: action.payload };

        default:
            return state;
    }
}



const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [state, dispatch] = useReducer(reducer, initialState);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const getCartCount = () => {
        let totalCount = 0;

        for (const items in state.cartItems) {
            for (const item in state.cartItems[items]) {
                try {
                    if (state.cartItems[items][item] > 0) {
                        totalCount += state.cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        }

        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
    
        for(const items in state.cartItems){
            let itemInfo = products.find((p) => p._id === items);
            for(const item in state.cartItems[items]){
                try {
                     if(state.cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * state.cartItems[items][item]
                     }
                } catch (error) {
                    console.log(error.message);
                }
            }
        }

        return totalAmount;
    }

    const fetchProducts = async () => {
        try {
            
            const res = await axios.get(backendUrl+"/api/product/list");
            console.log(res.data);

        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchProducts();
    },[])

    const value = {
        products, currency, delivery_fee, state, dispatch, getCartCount, getCartAmount, navigate, backendUrl, token ,setToken
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;