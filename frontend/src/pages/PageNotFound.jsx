import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuthContext } from "../context/AppContext.jsx";

const PageNotFound = () => {
    const { isLoggedIn } = useAuthContext();
    
    return (
        <div>
            <Navbar />
            <div className="pt-24 flex items-center justify-center flex-col">
                <p className="text-center p-4 text-2xl">Oops... Page Not Found</p>
                {
                    isLoggedIn ? (
                        <Link to="/" className="text-blue-600 text-sm">Go Back to Home</Link>
                    ) : (
                        <Link to="/login" className="text-blue-600 text-sm">Go to Login</Link>
                    )
                }
            </div>
        </div>
    )
};

export { PageNotFound };