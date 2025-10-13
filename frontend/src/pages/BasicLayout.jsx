import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuthContext } from "../context/AppContext";
import { CartSideBar } from "../components/cartSideBar";


const BasicLayout = () => {
    const { cart } = useAuthContext();
    // const cartItems = Object.values(cart);
    const isCartEmpty = cart?.length === 0;
    
    return (
        <div className={`grid ${isCartEmpty ? "grid-cols-1" : "grid-cols-[1fr_200px]"} min-h-screen`}>
            <Navbar />
            <Outlet />
            {
                !isCartEmpty && (
                   <CartSideBar />
                )
            }
        </div>
    )
}

export { BasicLayout };