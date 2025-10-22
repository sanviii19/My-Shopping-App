import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuthContext } from "../context/AppContext";
import { CartSideBar } from "../components/cartSideBar";


const BasicLayout = () => {
    const { cart, updatingCartState, appLoading, isLoggedIn, cartLoaded } = useAuthContext();
    
    // Only show cart if:
    // 1. User is logged in AND
    // 2. Cart has been loaded AND
    // 3. Cart has items
    const hasCartItems = cart && Array.isArray(cart) && cart.length > 0;
    const shouldShowCart = isLoggedIn && cartLoaded && hasCartItems;
    
    console.log("BasicLayout - cart:", cart);
    console.log("BasicLayout - cartLoaded:", cartLoaded);
    console.log("BasicLayout - hasCartItems:", hasCartItems);
    console.log("BasicLayout - shouldShowCart:", shouldShowCart);
    
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="relative min-h-screen pt-20">
                {/* Main content area */}
                <div className={`transition-all duration-300 ease-in-out ${shouldShowCart ? 'pr-80' : 'pr-0'}`}>
                    <Outlet />
                </div>
                
                {/* Cart Sidebar - Always rendered but slides in/out */}
                <div className={`fixed top-20 right-0 h-[calc(100vh-5rem)] w-80 transform transition-transform duration-300 ease-in-out z-40 ${
                    shouldShowCart ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <CartSideBar />
                </div>
            </div>
        </div>
    )
}

export { BasicLayout };