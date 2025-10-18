import React, { createContext, useContext, useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";

const AuthContext = createContext();

const AppContextProvider = ({children}) => {
      const [user, setUser] = useState({isLoggedIn: false});
      const [cart, setCart] = useState([]);
      const [appLoading, setAppLoading] = useState(true);
      const [placingOrder, setPlacingOrder] = useState(false);
      const [updatingCartState, setUpdatingCartState] = useState(false);
    
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
        }
    }, [isLoggedIn]);

      // add logout logic
      const handleLogout = async () => {
        try{
          setAppLoading(true);
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
            method: "GET",
            credentials: "include"
          })
      
          if(response.status === 200){
            showSuccessToast("Logged out successfully");
            setUser({isLoggedIn: false});
          }else{  
            const data = await response.json();
            showErrorToast(data.message);
          }
        }catch(err){
          showErrorToast("Error logging out. Please try again.");
        }finally{
          setAppLoading(false);
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
          setCart(result.data.cart);
        } catch (err) {
          console.error(err);
          showErrorToast("Error fetching cart items");
        }finally{
          setUpdatingCartState(false);
        }
      }

      const addToCart = async (productId) => {
        try {
          setUpdatingCartState(true);
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/${productId}`, {
            method: "POST",
            credentials: "include"
          });
          
          console.log("Add to cart response:", response);

          const result = await response.json();
          if (result.isSuccess) {
              setCart(result.data.cart);
          } else {
              showErrorToast(result.message);
            }
        } catch (err) {
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

          console.log("🟡 : response of removeFromCart:", response);
          const result = await response.json();
          if (result.isSuccess) {
              setCart(result.data.cart);
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
        addToCart,
        removeFromCart,
        handlePlaceOrder,
        placingOrder,
        updatingCartState
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