import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate, useParams } from "react-router";
import { GridLoader } from "react-spinners";
import { Button } from "../components/ui/Button";
import { showSuccessToast } from "../../utils/toastifyHelper";
import { useAuthContext } from "../context/AppContext";

const ViewPage = () => {
    const [loading, setLoading] = useState(false);
    const [productInfo, setProductInfo] = useState({});
    const {productId} = useParams();
    const { isLoggedIn, addToCart, removeFromCart, cart } = useAuthContext();
    const navigate = useNavigate();
    const getProductInfo = async () => {
        try{
            setLoading(true);
            // API call to get product based on product id
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products/view/${productId}`, {
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            setProductInfo(result.data.product);

        }
        catch(err){
            alert("Error fetching product details");
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getProductInfo();
    }, [productId]);

    const handleAddToCart = async(e) => {
        if(isLoggedIn && productInfo?._id){
            // add to the cart
            addToCart(productInfo._id);
            // Success toast is handled in addToCart function
        }
    }

    const isInCart = cart?.find((item) => item.productId?._id === productInfo?._id);
    
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />
            <div className="pt-20 pb-8">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96">
                        <GridLoader color="#3b82f6" size={15} />
                        <p className="mt-4 text-gray-600 animate-pulse">Loading product details...</p>
                    </div>
                ) : (
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        {/* Back Navigation */}
                        <div className="mb-6">
                            <button 
                                onClick={() => navigate('/products')}
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                            >
                                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="font-medium">Back to Products</span>
                            </button>
                        </div>
                        
                        <div className="bg-white/95 rounded-2xl shadow-2xl overflow-hidden transform hover:shadow-3xl transition-all duration-500 backdrop-blur-lg animate-fadeInUp">
                            <div className="lg:flex">
                                {/* Image Gallery */}
                                <div className="lg:w-1/2 p-4 lg:p-6">
                                    <div className="space-y-4">
                                        {productInfo.images?.length > 0 ? (
                                            <div className="space-y-4">
                                                {/* Main Image */}
                                                <div className="relative group">
                                                    <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                                                        {isImageLoading && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                            </div>
                                                        )}
                                                        <img 
                                                            src={productInfo.images[selectedImageIndex] || productInfo.images[0]} 
                                                            alt={productInfo.title}
                                                            className="w-full h-full object-cover hover:scale-110 transition-all duration-500 cursor-zoom-in"
                                                            onLoad={() => setIsImageLoading(false)}
                                                        />
                                                        {/* Image overlay with gradient */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                    
                                                    {/* Image navigation arrows */}
                                                    {productInfo.images.length > 1 && (
                                                        <>
                                                            <button 
                                                                onClick={() => setSelectedImageIndex(selectedImageIndex === 0 ? productInfo.images.length - 1 : selectedImageIndex - 1)}
                                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                                            >
                                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                </svg>
                                                            </button>
                                                            <button 
                                                                onClick={() => setSelectedImageIndex(selectedImageIndex === productInfo.images.length - 1 ? 0 : selectedImageIndex + 1)}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                                            >
                                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                {/* Thumbnail Gallery */}
                                                {productInfo.images.length > 1 && (
                                                    <div className="flex space-x-3 overflow-x-auto pb-2 px-2">
                                                        {productInfo.images.map((imgUrl, index) => (
                                                            <div 
                                                                key={index} 
                                                                onClick={() => setSelectedImageIndex(index)}
                                                                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-3 shadow-sm ${
                                                                    selectedImageIndex === index 
                                                                        ? 'border-blue-500 shadow-lg scale-110 ring-2 ring-blue-200' 
                                                                        : 'border-gray-200 hover:border-gray-300 hover:scale-105 hover:shadow-md'
                                                                }`}
                                                            >
                                                                <img 
                                                                    src={imgUrl} 
                                                                    alt={`${productInfo.title} ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                                                <div className="text-center">
                                                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-gray-500 text-lg font-medium">No Image Available</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="lg:w-1/2 p-4 lg:p-6 lg:border-l border-gray-100">
                                    <div className="space-y-4">
                                        {/* Product Info */}
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <h1 className="text-xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                                    {productInfo.title}
                                                </h1>
                                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                                                    <svg className="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        ₹{productInfo.price?.toLocaleString()}
                                                    </span>
                                                    <span className="text-lg text-gray-500 line-through">
                                                        ₹{Math.round(productInfo.price * 1.2)?.toLocaleString()}
                                                    </span>
                                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                        17% OFF
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center flex-wrap gap-4">
                                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                                                    productInfo.quantity > 0 
                                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200' 
                                                        : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200'
                                                }`}>
                                                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                                                        productInfo.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></div>
                                                    <span>
                                                        {productInfo.quantity > 0 
                                                            ? `${productInfo.quantity} in stock` 
                                                            : 'Out of stock'
                                                        }
                                                    </span>
                                                </div>
                                                
                                                {/* Rating */}
                                                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-full border border-yellow-200">
                                                    <div className="flex space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-medium text-yellow-800">4.2</span>
                                                    <span className="text-xs text-yellow-600">(128 reviews)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {productInfo.description && (
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                                                    {productInfo.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Features/Benefits */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                                                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293L9 6.586A1 1 0 0010.414 7H19a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-900">Free Shipping</p>
                                                    <p className="text-xs text-blue-700">On orders over ₹500</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-100">
                                                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-green-900">Quality Assured</p>
                                                    <p className="text-xs text-green-700">Authentic products</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Add to Cart Section */}
                                        <div className="space-y-4 pt-4 border-t border-gray-100">
                                            {isLoggedIn ? (
                                                <div className="space-y-3">
                                                    {isInCart ? (
                                                        <div className="space-y-3">
                                                            {/* Quantity Controls */}
                                                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                                                                <div className="text-center mb-3">
                                                                    <span className="text-sm font-medium text-gray-700">Quantity</span>
                                                                </div>
                                                                <div className="flex items-center justify-center space-x-3">
                                                                    <Button 
                                                                        onClick={(e) => {e.stopPropagation(); removeFromCart(productInfo._id)}} 
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="w-8 h-8 rounded-full border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center"
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                        </svg>
                                                                    </Button>
                                                                    <div className="bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm min-w-[50px] text-center">
                                                                        <span className="text-lg font-bold text-blue-600">
                                                                            {isInCart.cartQuantity}
                                                                        </span>
                                                                    </div>
                                                                    <Button 
                                                                        onClick={handleAddToCart}
                                                                        size="sm"
                                                                        className="w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center"
                                                                        disabled={productInfo.quantity <= isInCart.cartQuantity}
                                                                    >
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                        </svg>
                                                                    </Button>
                                                                </div>
                                                                
                                                                <div className="mt-6 flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-green-800 font-semibold text-lg">Successfully Added to Cart!</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="text-center mb-4">
                                                                <Button 
                                                                    onClick={handleAddToCart}
                                                                    disabled={productInfo.quantity === 0}
                                                                    className={`w-full max-w-md mx-auto py-5 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                                                        productInfo.quantity === 0 
                                                                            ? 'bg-gray-400 cursor-not-allowed' 
                                                                            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 hover:shadow-2xl'
                                                                    }`}
                                                                >
                                                                    {productInfo.quantity === 0 ? (
                                                                        <span className="flex items-center justify-center space-x-2">
                                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                                            </svg>
                                                                            <span>Out of Stock</span>
                                                                        </span>
                                                                    ) : (
                                                                        <span className="flex items-center justify-center space-x-2">
                                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16v0a1 1 0 001 1h1m0 0v0a1.5 1.5 0 003 0v0a1.5 1.5 0 003 0m0 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v7.5" />
                                                                            </svg>
                                                                            <span>Add to Cart</span>
                                                                        </span>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                            
                                                            <div className="flex justify-center space-x-4 mt-6">
                                                                <button className="flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-pink-50 to-red-50 border-2 border-pink-200 text-pink-700 rounded-xl hover:border-pink-300 hover:from-pink-100 hover:to-red-100 transition-all duration-200 transform hover:scale-105">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                    </svg>
                                                                    <span className="font-medium">Wishlist</span>
                                                                </button>
                                                                <button className="flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 rounded-xl hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 transform hover:scale-105">
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                                    </svg>
                                                                    <span className="font-medium">Share</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center space-y-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                                                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Login Required</h3>
                                                    <p className="text-gray-600 mb-4">Please sign in to add items to your cart and make purchases</p>
                                                    <Button 
                                                        onClick={() => navigate('/login')}
                                                        className="w-full py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                                    >
                                                        <span className="flex items-center justify-center space-x-2">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                            </svg>
                                                            <span>Login to Purchase</span>
                                                        </span>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Additional Information Section */}
                            <div className="bg-gray-50 p-4 lg:p-6 border-t border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
                                        <p className="text-sm text-gray-600">Free delivery within 2-3 business days</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Secure Payment</h4>
                                        <p className="text-sm text-gray-600">100% secure payment with SSL encryption</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                                        <p className="text-sm text-gray-600">30-day hassle-free return policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export { ViewPage };