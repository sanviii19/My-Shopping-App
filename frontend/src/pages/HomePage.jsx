import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router";

const HomePage = () => {
    const navigate = useNavigate();

    const categories = [
        { name: "Electronics", icon: "📱", color: "bg-blue-100 hover:bg-blue-200" },
        { name: "Fashion", icon: "👗", color: "bg-pink-100 hover:bg-pink-200" },
        { name: "Home", icon: "🏠", color: "bg-green-100 hover:bg-green-200" },
        { name: "Sports", icon: "⚽", color: "bg-orange-100 hover:bg-orange-200" },
        { name: "Books", icon: "📚", color: "bg-purple-100 hover:bg-purple-200" },
        { name: "Beauty", icon: "💄", color: "bg-red-100 hover:bg-red-200" }
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
        <div>
            <div className="pt-24 px-4 pb-12">
                {/* Hero Section */}
                <div className="max-w-6xl mx-auto text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        My Shopping App
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Discover amazing products across all categories
                    </p>
                    <button 
                        onClick={() => navigate("/search")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-medium transition-colors shadow-lg"
                    >
                        Browse All Products
                    </button>
                </div>

                {/* Categories Section */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Shop by Category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => handleCategoryClick(category.name)}
                                className={`${category.color} p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-3">{category.icon}</div>
                                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-6xl mx-auto mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Free Shipping</h3>
                            <p className="text-gray-600">Free delivery on orders over ₹999</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Payment</h3>
                            <p className="text-gray-600">100% secure payment processing</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-4xl mb-4">↩️</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Returns</h3>
                            <p className="text-gray-600">30-day hassle-free returns</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export { HomePage };