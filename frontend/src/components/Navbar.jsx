import { Link, useNavigate, useSearchParams } from "react-router";
import { IoMenuSharp } from "react-icons/io5";
import { useState, useContext, useRef, useEffect } from "react";
import { useAuthContext } from "../context/AppContext";

const Navbar = ({searchBar = true}) => {
    const [ query] = useSearchParams();
    const { isLoggedIn, handleLogout, user } = useAuthContext();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Debug logging to check user object
    console.log('Current user object:', user);
    console.log('User role:', user?.role);

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed w-full top-0 left-0 z-50">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                <Link to="/" className="flex items-center space-x-2 group cursor-pointer">
                    {/* Logo Icon */}
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    {/* Logo Text */}
                    <div className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors duration-200">
                        <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-extrabold tracking-wide">
                            MyShop
                        </span>
                    </div>
                </Link>
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
                    {isLoggedIn && (
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                className="text-white hover:text-blue-100 transition-all duration-200 p-2 rounded-lg hover:bg-blue-600/30 backdrop-blur-sm"
                                onClick={toggleDropdown}
                            >
                                <IoMenuSharp className={`w-6 h-6 transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                            </button>
                            
                            <div className={`absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 transition-all duration-300 ease-out transform ${
                                isDropdownOpen 
                                    ? 'opacity-100 scale-100 translate-y-0' 
                                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                            }`}>
                                <div className="py-2">
                                    <button
                                        onClick={() => handleMenuItemClick('/orders')}
                                        className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50/70 hover:text-blue-600 transition-all duration-200 group"
                                    >
                                        <span className="text-lg mr-3 transition-transform duration-200 group-hover:scale-110">📦</span>
                                        <div>
                                            <div className="font-semibold">My Orders</div>
                                            <div className="text-xs text-gray-500 group-hover:text-blue-500">View your order history</div>
                                        </div>
                                    </button>
                                    
                                    {user?.role === 'admin' && (
                                        <>
                                            <div className="border-t border-gray-100/50 my-2 mx-4"></div>
                                            <button
                                                onClick={() => handleMenuItemClick('/admin/dashboard')}
                                                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50/70 hover:to-blue-50/70 hover:text-purple-600 transition-all duration-200 group"
                                            >
                                                <span className="text-lg mr-3 transition-transform duration-200 group-hover:scale-110">⚙️</span>
                                                <div>
                                                    <div className="font-semibold flex items-center">
                                                        Admin Dashboard
                                                        <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">Admin</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 group-hover:text-purple-500">Manage your store</div>
                                                </div>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Navbar };