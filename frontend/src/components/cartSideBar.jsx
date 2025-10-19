import { useNavigate } from "react-router";
import { Button } from "./ui/Button";
import { useAuthContext } from "../context/AppContext";

const CartSideBar = () => {
    const { cart, addToCart, updatingCartState, removeFromCart } = useAuthContext();
    const navigate = useNavigate();

    const handleViewProduct = (productId) => {
        navigate(`/view/${productId}`);
    }

    const handleCheckoutClick = () => {
        navigate('/payment');
    }

    const totalItems = Array.isArray(cart) ? cart.reduce((sum, item) => sum + item.cartQuantity, 0) : 0;
    const totalPrice = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.productId.price * item.cartQuantity), 0) : 0;

    return (
        <div className="w-80 -mt-2 bg-white border-l border-gray-200 h-full flex flex-col shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 7H3m4 6v4a2 2 0 002 2h8a2 2 0 002-2v-4m-6 0V9a2 2 0 10-4 0v4.01" />
                    </svg>
                    <h2 className="text-lg font-bold">Shopping Cart</h2>
                </div>
                {cart?.length > 0 && (
                    <div className="bg-white/20 backdrop-blur rounded-full px-2 py-1">
                        <span className="text-xs font-semibold">{totalItems} items</span>
                    </div>
                )}
            </div>

            {/* Cart Content - Scrollable Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {cart?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 7H3m4 6v4a2 2 0 002 2h8a2 2 0 002-2v-4m-6 0V9a2 2 0 10-4 0v4.01" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-sm text-gray-500 mb-4">Add some products to get started!</p>
                        <button 
                            onClick={() => navigate('/search')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="p-3 space-y-3">
                        {cart?.map((cartItem, index) => {
                            return (
                                <div 
                                    key={cartItem?._id || index} 
                                    className="bg-white border rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer border-gray-200 hover:border-blue-200"
                                    onClick={() => handleViewProduct(cartItem?.productId?._id)}
                                >
                                    <div className="flex gap-3">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                <img 
                                                    src={cartItem?.productId?.images?.[0]} 
                                                    alt={cartItem?.productId?.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 truncate">
                                                {cartItem?.productId?.title}
                                            </h3>
                                            <p className="text-blue-600 font-bold text-base">
                                                ₹{cartItem?.productId?.price?.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Stock: {cartItem?.productId?.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                        <div className="flex items-center bg-gray-50 rounded-md">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    removeFromCart(cartItem?.productId?._id);
                                                }} 
                                                disabled={updatingCartState}
                                                className={`w-7 h-7 rounded-l-md bg-white border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                                                    updatingCartState 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                                                }`}
                                            >
                                                {updatingCartState ? (
                                                    <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                )}
                                            </button>
                                            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-200 min-w-[40px] text-center">
                                                {cartItem?.cartQuantity}
                                            </span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    addToCart(cartItem?.productId?._id);
                                                }} 
                                                className={`w-7 h-7 rounded-r-md bg-white border border-gray-200 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    updatingCartState 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                                                }`}
                                                disabled={updatingCartState}
                                            >
                                                {updatingCartState ? (
                                                    <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        
                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                ₹{(cartItem?.productId?.price * cartItem?.cartQuantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* Footer - Checkout Section */}
            {cart?.length > 0 && (
                <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50">
                    <div className="p-4 space-y-3">
                        {/* Price Summary */}
                        <div className="bg-white rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Items ({totalItems})</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Delivery</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex justify-between text-base font-bold text-gray-900">
                                    <span>Total</span>
                                    <span className="text-blue-600">₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Proceed to Payment Button */}
                        <button 
                            onClick={handleCheckoutClick} 
                            disabled={updatingCartState}
                            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                updatingCartState
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                            }`}
                        >
                            {updatingCartState ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Cart...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Proceed to Payment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export { CartSideBar };