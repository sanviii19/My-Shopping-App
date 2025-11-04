import { useNavigate } from "react-router";
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
        <div className="-mt-2 w-full h-full bg-white border-l border-gray-200 flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Shopping Bag</h2>
                        <p className="text-xs text-gray-500">
                            {cart?.length === 0 ? 'Your bag is empty' : `${totalItems} item${totalItems !== 1 ? 's' : ''} selected`}
                        </p>
                    </div>
                </div>
                {cart?.length > 0 && (
                    <div className="bg-indigo-50 text-indigo-700 rounded-md px-2 py-1 text-xs font-medium">
                        {totalItems}
                    </div>
                )}
            </div>

            {/* Cart Content - Scrollable Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
                {cart?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your bag is empty</h3>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-xs">
                            Start exploring our collection!
                        </p>
                        <button 
                            onClick={() => navigate('/search')}
                            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="px-3 py-3 space-y-2">
                        {cart?.map((cartItem, index) => {
                            return (
                                <div 
                                    key={cartItem?._id || index} 
                                    className="bg-white rounded-lg p-3 transition-all duration-300 hover:shadow-md cursor-pointer border border-gray-100 hover:border-indigo-200 group"
                                    onClick={() => handleViewProduct(cartItem?.productId?._id)}
                                >
                                    <div className="flex gap-3">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                                                <img 
                                                    src={cartItem?.productId?.images?.[0]} 
                                                    alt={cartItem?.productId?.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                                                {cartItem?.productId?.title}
                                            </h3>
                                            <div className="flex items-baseline gap-1 mb-1">
                                                <p className="text-gray-900 font-bold text-sm">
                                                    ₹{cartItem?.productId?.price?.toLocaleString()}
                                                </p>
                                                <span className="text-xs text-gray-500">each</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                                <span>{cartItem?.productId?.quantity} in stock</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                        <div className="flex items-center bg-gray-50 rounded-lg p-0.5 shadow-sm">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    removeFromCart(cartItem?.productId?._id);
                                                }} 
                                                disabled={updatingCartState}
                                                className={`w-7 h-7 rounded-md bg-white border-0 flex items-center justify-center transition-all duration-200 shadow-sm ${
                                                    updatingCartState 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:bg-red-50 hover:text-red-600 active:scale-95'
                                                }`}
                                            >
                                                {updatingCartState ? (
                                                    <svg className="animate-spin w-3 h-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-2.5 h-2.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                    </svg>
                                                )}
                                            </button>
                                            <span className="px-2 py-0.5 text-xs font-semibold text-gray-800 bg-transparent min-w-[24px] text-center">
                                                {cartItem?.cartQuantity}
                                            </span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    addToCart(cartItem?.productId?._id);
                                                }} 
                                                className={`w-5 h-5 rounded bg-white border-0 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    updatingCartState 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:bg-indigo-50 hover:text-indigo-600'
                                                }`}
                                                disabled={updatingCartState}
                                            >
                                                {updatingCartState ? (
                                                    <svg className="animate-spin w-3 h-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-2.5 h-2.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        
                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-900">
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
                <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                    <div className="px-3 py-3 space-y-2">
                        {/* Price Summary */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-md p-2 space-y-1 border border-gray-200">
                            <div className="flex justify-between items-center text-xs text-gray-700">
                                <span className="font-medium">Subtotal ({totalItems})</span>
                                <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-700">
                                <span className="font-medium">Shipping</span>
                                <span className="text-green-600 font-semibold">FREE</span>
                            </div>
                            <div className="border-t border-gray-300 pt-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-900">Total</span>
                                    <span className="text-base font-bold text-indigo-600">₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Proceed to Payment Button */}
                        <button 
                            onClick={handleCheckoutClick} 
                            disabled={updatingCartState}
                            className={`w-full py-2 rounded-md font-bold text-xs transition-all duration-300 shadow-md ${
                                updatingCartState
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-lg'
                            }`}
                        >
                            {updatingCartState ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Checkout
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export { CartSideBar };