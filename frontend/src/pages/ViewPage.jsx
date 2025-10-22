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
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-24 pb-12">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <GridLoader color="#3b82f6" size={15} />
                    </div>
                ) : (
                    <div className="w-full px-1 sm:px-2 lg:px-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden m-4" style={{maxWidth: 'calc(100vw - 450px)'}}>
                            <div className="lg:flex">
                                {/* Image Gallery */}
                                <div className="lg:w-1/2 p-6 lg:p-8">
                                    <div className="space-y-4">
                                        {productInfo.images?.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                                    <img 
                                                        src={productInfo.images[0]} 
                                                        alt={productInfo.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                {productInfo.images.length > 1 && (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {productInfo.images.slice(1, 4).map((imgUrl, index) => (
                                                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                                <img 
                                                                    src={imgUrl} 
                                                                    alt={`${productInfo.title} ${index + 2}`}
                                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="aspect-square rounded-xl bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 text-lg">No Image Available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="lg:w-1/2 p-6 lg:p-8">
                                    <div className="space-y-4">
                                        {/* Product Info */}
                                        <div>
                                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                                                {productInfo.title}
                                            </h1>
                                            <div className="flex items-center space-x-4 mb-4">
                                                <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                                                    ₹{productInfo.price?.toLocaleString()}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    productInfo.quantity > 0 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {productInfo.quantity > 0 
                                                        ? `${productInfo.quantity} in stock` 
                                                        : 'Out of stock'
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {productInfo.description && (
                                            <div className="mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {productInfo.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Add to Cart Section - Moved closer to description */}
                                        <div className="space-y-4 pt-10">
                                            {isLoggedIn ? (
                                                <div>
                                                    {isInCart ? (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                                <Button 
                                                                    onClick={(e) => {e.stopPropagation(); removeFromCart(productInfo._id)}} 
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-10 h-10 rounded-full"
                                                                >
                                                                    -
                                                                </Button>
                                                                <span className="text-lg font-semibold text-gray-900 min-w-[100px] text-center">
                                                                    Qty: {isInCart.cartQuantity}
                                                                </span>
                                                                <Button 
                                                                    onClick={handleAddToCart}
                                                                    size="sm"
                                                                    className="w-10 h-10 rounded-full"
                                                                    disabled={productInfo.quantity <= isInCart.cartQuantity}
                                                                >
                                                                    +
                                                                </Button>
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="text-green-600 font-medium flex items-center justify-center">
                                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Added to Cart
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Button 
                                                            onClick={handleAddToCart}
                                                            disabled={productInfo.quantity === 0}
                                                            className="w-full py-4 text-lg font-semibold rounded-xl"
                                                        >
                                                            {productInfo.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                                        </Button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <p className="text-gray-600 mb-4">Please login to add items to cart</p>
                                                    <Button 
                                                        onClick={() => navigate('/login')}
                                                        className="w-full py-4 text-lg font-semibold rounded-xl"
                                                    >
                                                        Login to Purchase
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
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