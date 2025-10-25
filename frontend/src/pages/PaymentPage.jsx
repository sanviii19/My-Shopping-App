import { useState } from "react";
import { Button } from "../components/ui/Button";
import { useAuthContext } from "../context/AppContext";
import { load } from "@cashfreepayments/cashfree-js";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";
import { useNavigate } from "react-router";

const PaymentPage = () => {
    const { cart, handlePlaceOrder, placingOrder, setCart } = useAuthContext();
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
            const fullName = e.target.fullName.value;
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
            if (!fullName || !email || !primaryContact || !streetAddress || !city || !state || !pinCode) {
                showErrorToast("Please fill all required fields");
                return;
            }

            console.log("Creating order with data:", {
                fullName,
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
                const {paymentSessionId : pId, orderId} = await handlePlaceOrder({
                    fullName,
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
            // paymentSessionId: "session_lYoR0VbQlRxRmxdpWzjM7rV7AI86Vo4qITwidciPM8KFmIgbTznQefr0qMg2_n3-42eMaQABpqBKHWkbvjPoSveSdPo2i--8KIKHyh_wGNqXPyDuSbvB2hjElMcuBQpaymentpayment",
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
                showSuccessToast("Order placed successfully!");
                setCart([]); // Clear cart only after successful payment
                await getOrderPaymentDetails(currentOrderId);
                navigate("/orders");
            }
        });
    };
}
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="text-center mb-6 animate-fade-in-up">
                    <div className="relative inline-block">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-2 relative">
                            Complete Your Order
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        </h1>
                    </div>
                    <p className="text-base text-gray-600 font-medium max-w-md mx-auto">
                        Just a few more details to get your items delivered safely
                    </p>
                    <div className="flex items-center justify-center mt-3 space-x-2">
                        <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-200">
                            <svg className="w-3.5 h-3.5 text-green-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-medium text-green-700">Secure Checkout</span>
                        </div>
                        <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
                            <svg className="w-3.5 h-3.5 text-blue-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-xs font-medium text-blue-700">Fast Delivery</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-8 py-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
                            <div className="relative z-10">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <div className="p-2 bg-white/20 rounded-lg mr-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    Delivery & Payment Information
                                </h2>
                                <p className="text-blue-100 text-sm mt-2 ml-11">Secure checkout process</p>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
                        </div>

                        {/* Form Content */}
                        <form className="p-8 space-y-10" onSubmit={handlePayment}> 
                            {/* Personal Information */}
                            <div className="animate-fade-in-up">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-bold mr-3">
                                        1
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Personal Information
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Full Name *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                                Email Address *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your.email@example.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="animate-fade-in-up">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-bold mr-3">
                                        2
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Contact Information
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                Primary Contact Number *
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="primaryContact"
                                            placeholder="+91 98765 43210"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                Alternate Contact Number
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="alternateContact"
                                            placeholder="+91 87654 32109 (Optional)"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="animate-fade-in-up">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-bold mr-3">
                                        3
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Delivery Address
                                    </h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                Street Address *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            placeholder="House/Flat No, Building Name, Street Name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Area/Locality *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="area"
                                            placeholder="Area, Locality, Landmark"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
                                                required
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                                State *
                                            </label>
                                            <select
                                                name="state"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
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
                                        <div className="group">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                                                PIN Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="pinCode"
                                                placeholder="400001"
                                                maxLength="6"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white group-focus-within:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Type */}
                            <div className="animate-fade-in-up">
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-bold mr-3">
                                        4
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Address Type
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="relative cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            value="home"
                                            className="sr-only peer"
                                            defaultChecked
                                        />
                                        <div className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50/50 group-hover:border-blue-300 group-hover:shadow-md">
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">🏠</div>
                                                <span className="text-sm font-medium text-gray-700 peer-checked:text-blue-700">Home</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200">
                                            <div className="w-full h-full rounded-full bg-white scale-0 peer-checked:scale-50 transition-transform duration-200"></div>
                                        </div>
                                    </label>
                                    <label className="relative cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            value="office"
                                            className="sr-only peer"
                                        />
                                        <div className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50/50 group-hover:border-blue-300 group-hover:shadow-md">
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">🏢</div>
                                                <span className="text-sm font-medium text-gray-700 peer-checked:text-blue-700">Office</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200">
                                            <div className="w-full h-full rounded-full bg-white scale-0 peer-checked:scale-50 transition-transform duration-200"></div>
                                        </div>
                                    </label>
                                    <label className="relative cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="addressType"
                                            value="other"
                                            className="sr-only peer"
                                        />
                                        <div className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 peer-checked:border-blue-500 peer-checked:bg-blue-50/50 group-hover:border-blue-300 group-hover:shadow-md">
                                            <div className="text-center">
                                                <div className="text-2xl mb-2">📍</div>
                                                <span className="text-sm font-medium text-gray-700 peer-checked:text-blue-700">Other</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-white border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200">
                                            <div className="w-full h-full rounded-full bg-white scale-0 peer-checked:scale-50 transition-transform duration-200"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Order Summary Section */}
                            <div className="relative animate-fade-in-up">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl"></div>
                                <div className="relative bg-white border-2 border-green-100 rounded-2xl overflow-hidden shadow-lg">
                                    <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 px-6 py-5 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-xl font-semibold text-white flex items-center">
                                                        <div className="p-2 bg-white/20 rounded-lg mr-3">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 7H3m4 6v4a2 2 0 002 2h8a2 2 0 002-2v-4m-6 0V9a2 2 0 10-4 0v4.01" />
                                                            </svg>
                                                        </div>
                                                        Order Summary
                                                    </h2>
                                                    <p className="text-green-100 text-sm mt-1">{totalItems} items in your cart</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-white">₹{finalTotal.toLocaleString()}</div>
                                                    <div className="text-green-200 text-xs">Total Amount</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Decorative elements */}
                                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                                        <div className="absolute -bottom-2 -left-2 w-14 h-14 bg-white/5 rounded-full"></div>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="px-6 py-5">
                                        {cart?.length === 0 ? (
                                            <div className="text-center py-10">
                                                <div className="w-18 h-18 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-9 h-9 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 7H3m4 6v4a2 2 0 002 2h8a2 2 0 002-2v-4m-6 0V9a2 2 0 10-4 0v4.01" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                                                <p className="text-sm text-gray-500">Add some products to proceed with checkout</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                                                {cart?.map((cartItem, index) => (
                                                    <div key={cartItem?._id || index} className="flex gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                                                        <div className="relative">
                                                            <img
                                                                src={cartItem?.productId?.images?.[0]}
                                                                alt={cartItem?.productId?.title}
                                                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                                                                onError={(e) => {
                                                                    e.target.src = "https://via.placeholder.com/56x56/e5e7eb/9ca3af?text=No+Image";
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                                                                {cartItem?.productId?.title}
                                                            </h4>
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm text-gray-500">
                                                                    Qty: {cartItem?.cartQuantity}
                                                                </span>
                                                                <span className="text-sm font-bold text-green-600">
                                                                    ₹{(cartItem?.productId?.price * cartItem?.cartQuantity).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                ₹{cartItem?.productId?.price?.toLocaleString()} each
                                                            </div>
                                                            {cartItem?.productId?.quantity < cartItem?.cartQuantity && (
                                                                <div className="flex items-center mt-2 p-2 bg-red-50 rounded-lg">
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
                                        <div className="mt-6 pt-5 border-t-2 border-gradient-to-r from-gray-200 to-blue-100">
                                            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-5 space-y-4">
                                                <h4 className="text-base font-semibold text-gray-900 mb-4">Price Details</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                            Subtotal ({totalItems} items)
                                                        </span>
                                                        <span className="font-medium text-gray-900">₹{totalPrice.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                            </svg>
                                                            Delivery Fee
                                                        </span>
                                                        <span className="text-green-600 font-bold">
                                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toLocaleString()}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Taxes & Fees
                                                        </span>
                                                        <span className="text-green-600 font-medium">Included</span>
                                                    </div>
                                                </div>
                                                <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                                        <span className="text-xl font-bold text-green-600 bg-green-100 px-4 py-2 rounded-lg">₹{finalTotal.toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-xs text-green-600 text-center mt-2 font-medium">You save ₹49 on delivery!</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Place Order Button */}
                                        <div className="mt-8">
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className={`w-full font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center text-lg relative overflow-hidden ${
                                                    placingOrder || loading
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl'
                                                } text-white`}
                                            >
                                                {/* Background decoration */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                                
                                                {placingOrder || loading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        {loading ? 'Processing Payment...' : 'Creating Payment Session...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center relative z-10">
                                                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>Proceed to Payment</span>
                                                        </div>
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-xs text-gray-500 text-center mt-3">
                                                🔒 By placing your order, you agree to our 
                                                <span className="text-blue-600 hover:underline cursor-pointer"> Terms & Conditions</span>
                                            </p>
                                        </div>

                                        {/* Security Badges */}
                                        <div className="mt-6 flex items-center justify-center space-x-6">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                Secure Payment
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                SSL Encrypted
                                            </div>
                                        </div>
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