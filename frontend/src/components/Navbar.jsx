import { Link, useNavigate, useSearchParams } from "react-router";
import { IoMenuSharp } from "react-icons/io5";
import { useState, useContext } from "react";
import { useAuthContext } from "../context/AppContext";

const Navbar = ({searchBar = true}) => {
    const [ query] = useSearchParams();
    const { isLoggedIn, handleLogout } = useAuthContext();
    const navigate = useNavigate();

    const searchTextValue = query.get("text");

    const [searchText, setSearchText] = useState(searchTextValue || "");
    
    const handleSearch = () => {
        navigate(`/search?text=${searchText}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLogoutAndNavigate = async () => {
        const success = await handleLogout();
        if (success) {
            // Force a full page reload to ensure the routing switches to unauthenticated routes
            window.location.href = "/login";
        } else {
            // If logout failed, still try to navigate to login
            navigate("/login");
        }
    };

    return (
        <div className="fixed w-full top-0 left-0 z-50">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                <div className="text-2xl font-bold text-white hover:text-blue-100 transition-colors duration-200">
                    My Shopping App
                </div>
                {
                    searchBar && (
                        <div className="flex-1 max-w-xl mx-4">
                            <div className="relative">
                                <input  
                                    className="w-full px-4 py-2 rounded-lg border-2 border-blue-300 focus:border-blue-400 focus:outline-none bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 shadow-inner"
                                    placeholder="Search products..."
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition-colors duration-200 shadow-sm"
                                    onClick={handleSearch}>
                                    Search
                                </button>
                            </div>
                        </div>
                    )}
                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-white hover:text-blue-100 font-medium transition-colors duration-200">Home</Link>
                    {isLoggedIn ? (
                        <button className="text-white hover:text-blue-100 font-medium transition-colors duration-200"
                         onClick={handleLogoutAndNavigate}>
                            Logout
                         </button>
                    ) : (
                        <Link to="/login" className="text-white hover:text-blue-100 font-medium transition-colors duration-200">Login</Link>
                    )}
                    <button className="text-white hover:text-blue-100 transition-colors duration-200">
                        <IoMenuSharp className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export { Navbar };