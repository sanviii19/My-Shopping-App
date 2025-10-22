import React, { createContext, useContext, useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";

const AuthContext = createContext();

const AppContextProvider = ({children}) => {
      const [user, setUser] = useState({isLoggedIn: false});
      const [cart, setCart] = useState([]);
      const [appLoading, setAppLoading] = useState(true);
      const [cartLoaded, setCartLoaded] = useState(false);
      const [placingOrder, setPlacingOrder] = useState(false);
      const [updatingCartState, setUpdatingCartState] = useState(false);
      const [isLoggingOut, setIsLoggingOut] = useState(false);
    
      const { isLoggedIn } = user;

      const authenticateUser = async() => {
        try{
          setAppLoading(true);
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
            method: "GET",
            credentials: "include"
          })
      
          if(response.status === 200){
            const result = await response.json();
            setUser({
              isLoggedIn: true,
              ...result.data.user,
            })
          }else{
            // Ensure user is set to logged out state
            setUser({isLoggedIn: false});
            showErrorToast("Session expired. Please login again.");
          }
        }catch(err){
          // Ensure user is set to logged out state on error
          setUser({isLoggedIn: false});
          showErrorToast("Error authenticating user. Please login again.");
        }finally{
          setAppLoading(false);
        }
      }

      useEffect(() => {
        authenticateUser();
      }, []);

      useEffect(() => {
        if (isLoggedIn) {
            getCartItems();
        } else {
            setCart([]);
            setCartLoaded(true);
        }
    }, [isLoggedIn]);

      // add logout logic
      const handleLogout = async () => {
        try{
          setIsLoggingOut(true);
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
            method: "GET",
            credentials: "include"
          })
      
          if(response.status === 200){
            showSuccessToast("Logged out successfully");
            // Don't set user state here - let the page reload handle it
            return true; // Return success indicator
          }else{  
            const data = await response.json();
            showErrorToast(data.message);
            setIsLoggingOut(false);
            return false;
          }
        }catch(err){
          showErrorToast("Error logging out. Please try again.");
          setIsLoggingOut(false);
          return false;
        }
      }

      const getCartItems = async () => {
        try {
          setUpdatingCartState(true);
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include"
          });
          const result = await response.json();
          // Fix: API returns 'cartItems' not 'cart'
          const cartData = Array.isArray(result.data?.cartItems) ? result.data.cartItems : [];
          setCart(cartData);
        } catch (err) {
          console.error(err);
          // Set empty array on error
          setCart([]);
          showErrorToast("Error fetching cart items");
        }finally{
          setUpdatingCartState(false);
          setCartLoaded(true);
        }
      }

      const addToCart = async (productId) => {
        try {
          console.log("Adding to cart - productId:", productId);
          console.log("Cart before add:", cart);
          setUpdatingCartState(true);
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/${productId}`, {
            method: "POST",
            credentials: "include"
          });
          
          const result = await response.json();
          console.log("Add to cart API response:", result);
          if (result.isSuccess) {
              // Backend returns 'cart' not 'cartItems'
              const newCartItems = Array.isArray(result.data.cart) ? result.data.cart : [];
              console.log("Setting new cart items:", newCartItems);
              setCart(newCartItems);
              showSuccessToast("Product added to cart!");
          } else {
              showErrorToast(result.message);
            }
        } catch (err) {
            console.error("Error in addToCart:", err);
            showErrorToast(`Error during adding product to cart: ${err.message}`);
        } finally {
            setUpdatingCartState(false);
        }
      }

      const removeFromCart = async (productId) => {
        try {
          setUpdatingCartState(true);
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/${productId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include"
          });

          const result = await response.json();
          if (result.isSuccess) {
              // Backend returns 'cart' not 'cartItems'
              setCart(Array.isArray(result.data.cart) ? result.data.cart : []);
          } else {
              showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(`Error during removing product from cart: ${err.message}`);
        } finally {
            setUpdatingCartState(false);
        }
      }

      const handleSetUser = (data) => {
        // add any logic if needed
        setUser(data);
      }

      // const clearCart = async () => {
      //   try {
      //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
      //       method: "DELETE",
      //       headers: {
      //         "Content-Type": "application/json"
      //       },
      //       credentials: "include"
      //     });
          
      //     if (response.ok) {
      //       setCart([]);
      //     } else {
      //       const result = await response.json();
      //       showErrorToast(result.message || "Error clearing cart");
      //     }
      //   } catch (err) {
      //     showErrorToast("Error clearing cart");
      //   }
      // }

      const handlePlaceOrder = async ({fullName, email, streetAddress, city, state, primaryContact, alternateContact}) => {
           try{
          setPlacingOrder(true);

          if (!streetAddress || streetAddress.trim() === '') {
            showErrorToast("Please provide a delivery address");
            return null;
          }

          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ fullName, streetAddress, city, state, primaryContact, alternateContact }),
            headers: {
              "Content-Type": "application/json"
            }
          })

           console.log("🟡 : response:", response);

          const result = await response.json();
          
          if(result.isSuccess){

            showSuccessToast(result.message);
                setCart([]);
                return {
                    paymentSessionId: result.data.paymentDetails.payment_session_id,
                    orderId: result.data.orderId,
                };


            // If payment session ID is returned, return it for Cashfree payment
            // if (result.paymentSessionId) {
            //   return { paymentSessionId: result.data.paymentDetails.payment_session_id, orderId: result.data.orderId };
            // }
            
            // // If no payment session ID, this is a direct order (no payment gateway)
            // showSuccessToast(result.message);
            
            // // Show updated stock information
            // if (result.data && result.data.orderedItems) {
            //   const stockUpdates = result.data.orderedItems.map(item => 
            //     `${item.title}: ${item.orderedQuantity} ordered, ${item.newStock} remaining`
            //   ).join('\n');
              
            //   // You can display this in a modal or notification
            //   console.log('Stock Updates:', stockUpdates);
            // }
            
            // // Clear cart both locally and on server
            // await clearCart();
            // return null; // No payment session needed
          }else{  
            showErrorToast(result.message);
            return null;
          }
        }catch(err){
          console.error("Order creation error:", err);
          showErrorToast("Error placing order. Please try again.");
          return null;
        }finally{
          setPlacingOrder(false);
        }
      }

      const sharedState = {
        user,
        handleSetUser,
        handleLogout,
        appLoading,
        isLoggedIn,
        cart,
        cartLoaded,
        addToCart,
        removeFromCart,
        handlePlaceOrder,
        placingOrder,
        updatingCartState,
        isLoggingOut
      };

     return (
        <AuthContext.Provider value={sharedState}>{children}</AuthContext.Provider>
     )
}

function useAuthContext() {
    return useContext(AuthContext);
}

export default AppContextProvider;
export { useAuthContext };