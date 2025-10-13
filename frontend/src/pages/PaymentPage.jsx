import { useState } from "react";
import { Button } from "../components/ui/Button";
import { useAuthContext } from "../context/AppContext";
import { load } from "@cashfreepayments/cashfree-js";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";
import { useNavigate } from "react-router";

const PaymentPage = () => {
    const { cart, handlePlaceOrder, placingOrder } = useAuthContext();
    const [paymentSessionId, setPaymentSessionId] = useState("");
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getOrderPaymentDetails = async (orderId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/payment-status`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (response.status == 200) {
                showSuccessToast("Payment Details Fetched");
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(err.message);
        }
    };

    const totalItems = cart?.reduce((sum, item) => sum + item.cartQuantity, 0) || 0;
    const totalPrice = cart?.reduce((sum, item) => sum + (item.productId.price * item.cartQuantity), 0) || 0;
    const deliveryFee = 0; // Free delivery
    const finalTotal = totalPrice + deliveryFee;

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if cart is not empty
        if (!cart || cart.length === 0) {
            showErrorToast("Your cart is empty. Please add items to proceed.");
            setLoading(false);
            return;
        }

        let currentPaymentSessionId = paymentSessionId;
        let currentOrderId = orderId;

        if(currentPaymentSessionId === ""){
            const name = e.target.fullName.value;
            const email = e.target.email.value;
            const primaryContact = e.target.primaryContact.value;
            const alternateContact = e.target.alternateContact.value;
            const streetAddress = e.target.streetAddress.value;
            const locality = e.target.area.value;
            const city = e.target.city.value;
            const state = e.target.state.value;
            const pinCode = e.target.pinCode.value;
            const addressType = e.target.addressType.value;

            // Validate required fields
            if (!name || !email || !primaryContact || !streetAddress || !city || !state || !pinCode) {
                showErrorToast("Please fill all required fields");
                return;
            }

            console.log("Creating order with data:", {
                fullName: name, 
                email, 
                streetAddress, 
                city, 
                state, 
                primaryContact, 
                alternateContact,
                cartItems: cart?.length || 0,
                totalAmount: finalTotal
            });

            console.log(`paymentSessionId: ${paymentSessionId}`);

            try {
                setLoading(true);
                const {paymentSessionId, orderId} = await handlePlaceOrder({
                    fullName: name, 
                    email, 
                    streetAddress, 
                    city, 
                    state, 
                    primaryContact, 
                    alternateContact
                });

                currentPaymentSessionId = pId;
                currentOrderId = orderId;
                console.log("🟡 : paymentSessionId:", currentPaymentSessionId);
                setPaymentSessionId(currentPaymentSessionId);
                setOrderId(currentOrderId);
                
                if (!currentPaymentSessionId) {
                    console.log("Backend returned no payment session ID.");
                    console.log("To enable Cashfree payments, update your backend /orders endpoint to:");
                    console.log("1. Create a Cashfree payment session using your Cashfree credentials");
                    console.log("2. Return the paymentSessionId in the response: { isSuccess: true, paymentSessionId: 'session_id_here' }");
                    
                    showErrorToast("Payment gateway not configured. Order was placed without payment processing.");
                    setLoading(false);
                    return;
                }
                
                setPaymentSessionId(currentPaymentSessionId);
                setOrderId(currentOrderId);
            
            } catch {
                console.log("error in creating payment session");
            } finally {
                setLoading(false);
            }


        let cashfree;

        try {
            setLoading(true);
            var initializeSDK = async function () {
                cashfree = await load({
                    mode: "sandbox",
                });
            };

            await initializeSDK();
        } catch {
            console.log("error in cashfree SDK initialization");
        } finally {
            setLoading(false);
        }

        let checkoutOptions = {
            paymentSessionId: currentPaymentSessionId,
            redirectTarget: "_modal",
        };

        cashfree.checkout(checkoutOptions).then(async (result) => {
            if (result.error) {
                // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
                console.log("User has closed the popup or there is some payment error, Check for Payment Status");
                console.log(result.error);
                showErrorToast("Payment failed! Please try again!");
            }
            if (result.redirect) {
                // This will be true when the payment redirection page couldn't be opened in the same window
                // This is an exceptional case only when the page is opened inside an inAppBrowser
                // In this case the customer will be redirected to return url once payment is completed
                console.log("Payment will be redirected");
            }
            if (result.paymentDetails) {
                // This will be called whenever the payment is completed irrespective of transaction status
                console.log("Payment has been completed, Check for Payment Status");
                console.log(result.paymentDetails.paymentMessage);
                showSuccessToast("Payment succeed!");
                await getOrderPaymentDetails(currentOrderId);
                navigate("/orders");
            }
        });
    };
}
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Delivery Address & Contact Information
                            </h2>
                        </div>

                        {/* Form Content */}
                        <form className="p-6 space-y-8" onSubmit={handlePayment}> 
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your.email@example.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Primary Contact Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="primaryContact"
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Alternate Contact Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="alternateContact"
                                            placeholder="+91 87654 32109 (Optional)"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Delivery Address
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            placeholder="House/Flat No, Building Name, Street Name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Area/Locality *
                                        </label>
                                        <input
                                            type="text"
                                            name="area"
                                            placeholder="Area, Locality, Landmark"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State *
                                            </label>
                                            <select
                                                name="state"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                                required
                                            >
                                                <option value="">Select State</option>
                                                <option value="maharashtra">Maharashtra</option>
                                                <option value="delhi">Delhi</option>
                                                <option value="karnataka">Karnataka</option>
                                                <option value="tamil-nadu">Tamil Nadu</option>
                                                <option value="gujarat">Gujarat</option>
                                                <option value="rajasthan">Rajasthan</option>
                                                <option value="uttar-pradesh">Uttar Pradesh</option>
                                                <option value="west-bengal">West Bengal</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                PIN Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="pinCode"
                                                placeholder="400001"
                                                maxLength="6"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Type */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Address Type
                                </h3>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            value="home"
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            defaultChecked
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">🏠 Home</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            value="office"
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">🏢 Office</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            value="other"
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">📍 Other</span>
                                    </label>
                                </div>
                            </div>

                            {/* Order Summary Section */}
                            <div className="border-t border-gray-200 pt-8">
                                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 -mx-6">
                                    <h2 className="text-xl font-semibold text-white flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 7H3m4 6v4a2 2 0 002 2h8a2 2 0 002-2v-4m-6 0V9a2 2 0 10-4 0v4.01" />
                                        </svg>
                                        Order Summary
                                    </h2>
                                    <p className="text-green-100 text-sm mt-1">{totalItems} items in your cart</p>
                                </div>

                                {/* Cart Items */}
                                <div className="px-6 py-4">
                                    {cart?.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 7H3m4 6v4a2 2 0 002 2h8a2 2 0 002-2v-4m-6 0V9a2 2 0 10-4 0v4.01" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                                            <p className="text-gray-500">Add some products to proceed with checkout</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart?.map((cartItem, index) => (
                                                <div key={cartItem?._id || index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <img
                                                        src={cartItem?.productId?.images?.[0]}
                                                        alt={cartItem?.productId?.title}
                                                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = "https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=No+Image";
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                            {cartItem?.productId?.title}
                                                        </h4>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500">Qty: {cartItem?.cartQuantity}</span>
                                                            <span className="text-sm font-semibold text-blue-600">
                                                                ₹{(cartItem?.productId?.price * cartItem?.cartQuantity).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            ₹{cartItem?.productId?.price?.toLocaleString()} each
                                                        </div>
                                                        {cartItem?.productId?.quantity < cartItem?.cartQuantity && (
                                                            <div className="flex items-center mt-1">
                                                                <svg className="w-3 h-3 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-red-600 font-medium text-xs">Low stock!</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Price Breakdown */}
                                    <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal ({totalItems} items)</span>
                                            <span>₹{totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Delivery Fee</span>
                                            <span className="text-green-600 font-medium">
                                                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toLocaleString()}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Taxes & Fees</span>
                                            <span>Included</span>
                                        </div>
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                                <span>Total Amount</span>
                                                <span className="text-green-600">₹{finalTotal.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Place Order Button */}
                                    <div className="mt-6">
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center ${
                                                placingOrder || loading
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 shadow-lg hover:shadow-xl'
                                            } text-white`}
                                        >
                                            {placingOrder || loading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {loading ? 'Processing Payment...' : 'Creating Payment Session...'}
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Place Order - ₹{finalTotal.toLocaleString()}
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-gray-500 text-center mt-2">
                                            By placing your order, you agree to our Terms & Conditions
                                        </p>
                                    </div>

                                    {/* Security Badge */}
                                    <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Secure & Encrypted Payment
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PaymentPage };