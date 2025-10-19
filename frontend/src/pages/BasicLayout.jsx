import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuthContext } from "../context/AppContext";
import { CartSideBar } from "../components/cartSideBar";


const BasicLayout = () => {
    const { cart, updatingCartState } = useAuthContext();
    
    // Ensure cart is treated as empty if it's null, undefined, or has no items
    // Don't hide cart during updates to prevent flickering
    const isCartEmpty = (!updatingCartState) && (!cart || !Array.isArray(cart) || cart.length === 0);
    
    console.log("BasicLayout - cart:", cart);
    console.log("BasicLayout - updatingCartState:", updatingCartState);
    console.log("BasicLayout - isCartEmpty:", isCartEmpty);
    
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className={`${isCartEmpty ? "w-full" : "grid grid-cols-[1fr_320px]"} min-h-screen pt-20`}>
                <div className="min-h-full">
                    <Outlet />
                </div>
                {
                    !isCartEmpty && (
                       <CartSideBar />
                    )
                }
            </div>
        </div>
    )
}

export { BasicLayout };