import React, { createContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <= 3000; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth-token')); // Track authentication status

    useEffect(() => {
        // Fetch products from the API
        fetch('http://localhost:4000/allproducts')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setAll_Product(data);
                console.log('Fetched products:', data);
            })
            .catch((error) => {
                console.error('Failed to fetch products:', error);
            });

        // Fetch cart items if user is authenticated
        if (isAuthenticated) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({})
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched cart items:', data);
                setCartItems(data);
            })
            .catch((error) => {
                console.error('Failed to fetch cart items:', error);
            });
        }
    }, [isAuthenticated]); // Run this effect when `isAuthenticated` changes

    const addToCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            }).then((response)=>response.json())
            .then((data)=>console.log(data))
        }
    }

    
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1
        }));
    
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }), // Include itemId in the body
            })
            .then((response) => response.json()) // Corrected from response.json to response.json()
            .then((data) => {
                console.log(data); // Log the response data from the server
                // Optionally, update local state or perform additional actions based on server response
            })
            .catch((error) => {
                console.error('Error removing item from cart:', error);
                // Handle error scenarios
            });
        }
    };
    const saveCartToServer = (cartItems) => {
        fetch('http://localhost:4000/updatecart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'auth-token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartItems),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Cart saved to server:', data);
            // Optionally, handle the response data from the server
        })
        .catch((error) => {
            console.error('Failed to save cart to server:', error);
            // Handle error scenarios
        });
    };
    


    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const logout = () => {
        // Clear authentication token and cart items on logout
        localStorage.removeItem('auth-token');
        setIsAuthenticated(false);
        setCartItems(getDefaultCart());
    };

    const login = (token) => {
        // Set authentication token and fetch cart items
        localStorage.setItem('auth-token', token);
        setIsAuthenticated(true);
        fetch('http://localhost:4000/getcart', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'auth-token': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log('Fetched cart items on login:', data);
            setCartItems(data);
        })
        .catch((error) => {
            console.error('Failed to fetch cart items on login:', error);
        });
    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        saveCartToServer,
        logout,
        login,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
