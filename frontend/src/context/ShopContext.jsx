/* eslint-disable no-case-declarations */
import { createContext, useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


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

        case "SET_CART":
            return { ...state, cartItems: action.payload }

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
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const navigate = useNavigate();

    const cartCount = useMemo(() => {
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
    }, [state.cartItems])

    const cartAmount = useMemo(() => {
        let totalAmount = 0;

        for (const items in state.cartItems) {

            let itemInfo = products.find((p) => p._id === items);
            if (!itemInfo)
                continue;

            for (const item in state.cartItems[items]) {
                try {
                    if (state.cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * state.cartItems[items][item]
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        }

        return totalAmount;
    }, [state.cartItems, products])

    const fetchProducts = async () => {
        try {

            const res = await axios.get(backendUrl + "/api/product/list");
            if (res.status === 201) {
                setProducts(res.data.products);
            }

        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const fetchUserCart = async (token) => {
        if(!token) return null;
        try {
            const res = await axios.get(backendUrl + '/api/cart/get', { headers: { token } });

            if (res.status === 201) {
                dispatch({ type: "SET_CART", payload: res.data.cartData });
            }

        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const addToCartHandler = async (productId, size) => {

        if (token) {

            try {

                const res = await axios.post(`${backendUrl}/api/cart/add`, {
                    itemId: productId,
                    size,
                }, { headers: { token } });

                if (res.status === 201) {
                    dispatch({
                        type: "ADD_TO_CART",
                        payload: { id: productId, size },
                    });
                    toast.success("Item added to cart");
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to add to cart");
            }
        }

    }

    const updateCartHandler = async (productId, size, quantity) => {
        if (token) {
            try {
                const res = await axios.post(`${backendUrl}/api/cart/update`, {
                    itemId: productId,
                    size,
                    quantity,
                }, { headers: { token } });

                if (res.status === 201) {
                    dispatch({
                        type: "UPDATE_CART",
                        payload: { id: productId, size, quantity },
                    });
                    toast.success("Cart updated");
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to update cart");
            }
        }
    };

    const removeFromCartHandler = async (productId, size) => {
        if (token) {

            try {
                const res = await axios.delete(`${backendUrl}/api/cart/delete`, {
                    data: { userId: token, itemId: productId, size },
                    headers: { token }
                });

                if (res.status === 201) {
                    dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: { id: productId, size },
                    });
                    toast.success("Item removed from cart");
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to remove item");
            }
        }
    };

    const clearCartHandler = async () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const setSearchHandler = (query) => {
        dispatch({
            type: "SET_SEARCH",
            payload: query,
        });
    };

    const setShowSearchHandler = (show) => {
        dispatch({
            type: "SET_SHOW_SEARCH",
            payload: show,
        });
    };



    useEffect(() => {
        fetchProducts();
        fetchUserCart(token);
    }, [token])

    const value = {
        products,
        currency,
        delivery_fee,
        state,
        cartCount,
        cartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        addToCartHandler,
        updateCartHandler,
        removeFromCartHandler,
        clearCartHandler,
        setSearchHandler,
        setShowSearchHandler
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;