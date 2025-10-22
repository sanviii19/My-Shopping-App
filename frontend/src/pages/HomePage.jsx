import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router";

const HomePage = () => {
    const navigate = useNavigate();

    const categories = [
        { 
            name: "Electronics", 
            icon: "📱", 
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop&crop=center",
            description: "Latest gadgets & tech"
        },
        { 
            name: "Fashion", 
            icon: "👗", 
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&crop=center",
            description: "Trendy clothing & accessories"
        },
        { 
            name: "Home & Living", 
            icon: "🏠", 
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center",
            description: "Home decor & essentials"
        },
        { 
            name: "Sports", 
            icon: "⚽", 
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
            description: "Sports & fitness gear"
        },
        { 
            name: "Books", 
            icon: "📚", 
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center",
            description: "Books & educational"
        },
        { 
            name: "Beauty", 
            icon: "💄", 
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&crop=center",
            description: "Beauty & personal care"
        },
        { 
            name: "Grocery", 
            icon: "🛒", 
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center",
            description: "Fresh groceries"
        },
        { 
            name: "Automotive", 
            icon: "🚗", 
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop&crop=center",
            description: "Auto parts & accessories"
        }
    ];

    const handleCategoryClick = (categoryName) => {
        navigate(`/search?text=${categoryName.toLowerCase()}`);
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            navigate(`/search?text=${searchText.trim()}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className=" -mt-2 relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                <div className="relative pt-24 pb-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            {/* Left Content */}
                            <div className="flex-1 text-white">
                                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                    <span className="text-blue-100">Premium</span> Products at<br/>
                                    <span className="text-white">your </span>
                                    <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent font-extrabold">Doorsteps</span>
                                </h1>
                                <p className="text-lg text-blue-100 mb-6 leading-relaxed max-w-lg">
                                    Discover amazing products across all categories with fast delivery and premium quality.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={() => navigate("/search")}
                                        className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        START SHOPPING
                                    </button>
                                    <button 
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
                                    >
                                        JOIN NOW
                                    </button>
                                </div>
                            </div>

                            {/* Right Content - Shopping Cart Illustration */}
                            <div className="flex-1 relative lg:block hidden">
                                <div className="relative w-full max-w-sm mx-auto">
                                    {/* Shopping Cart SVG */}
                                    <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                                        <svg className="w-full h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                                            <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
                                        </svg>
                                    </div>
                                    {/* Floating Elements */}
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-lg animate-bounce">
                                        🛍️
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-sm animate-pulse">
                                        ⭐
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-6 mt-8 text-center text-white">
                            <div>
                                <div className="text-2xl lg:text-3xl font-bold mb-1">14k+</div>
                                <div className="text-blue-100 text-xs uppercase tracking-wider">
                                    PRODUCT VARIETIES
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl lg:text-3xl font-bold mb-1">50k+</div>
                                <div className="text-blue-100 text-xs uppercase tracking-wider">
                                    HAPPY CUSTOMERS
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl lg:text-3xl font-bold mb-1">10+</div>
                                <div className="text-blue-100 text-xs uppercase tracking-wider">
                                    STORE LOCATIONS
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Strip */}
            <div className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Feature 1 */}
                        <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 group hover:shadow-lg transition-all duration-200">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Premium Quality</h3>
                                <p className="text-gray-600 text-xs">Hand-picked products with quality guarantee.</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 group hover:shadow-lg transition-all duration-200">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">100% Authentic</h3>
                                <p className="text-gray-600 text-xs">Genuine products from authorized dealers.</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 group hover:shadow-lg transition-all duration-200">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Free Delivery</h3>
                                <p className="text-gray-600 text-xs">Fast delivery to your doorstep.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="py-12 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Category</h2>
                        <button 
                            onClick={() => navigate("/search")}
                            className="text-blue-500 hover:text-blue-600 font-semibold flex items-center space-x-2 group"
                        >
                            <span>View All</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => handleCategoryClick(category.name)}
                                className="group cursor-pointer"
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                                    <div className="aspect-square p-3 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                                        <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                                            {category.icon}
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                </div>
                                <div className="text-center mt-2">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 text-xs">{category.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 hidden md:block">{category.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export { HomePage };