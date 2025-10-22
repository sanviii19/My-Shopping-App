import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";
import { format } from "date-fns";
import { Button } from "../components/ui/Button";

const OrdersPage = () => {
     const [orders, setOrders] = useState([]); 
     const [loading, setLoading] = useState(true);
     
    const getAllOrders = async () => {
        try {
            setLoading(true);
            // Try user orders endpoint first, fallback to admin endpoint for testing
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            if (response.status === 200) {
                setOrders(data.data.orders || []);
                console.log("Orders data:", data);
            } else {
                showErrorToast(data.message);
            }
        } catch (error) {
            showErrorToast("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const getOrderPaymentDetails = async (orderId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/payment-status`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (response.status == 200) {
                showSuccessToast("Order status refreshed");
                getAllOrders();
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast("Failed to refresh order status");
        }
    };

    const getOrderStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const calculateOrderTotal = (products) => {
        return products?.reduce((total, item) => total + (item.price * item.cartQuantity), 0) || 0;
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-gray-600">Track and manage your orders</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {orders.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-6">When you place orders, they'll appear here</p>
                        <button 
                            onClick={() => window.location.href = '/search'}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    /* Orders List */
                    <div className="space-y-6">
                        {orders.map(({_id, address, createdAt, productIds, contactNumbers, orderStatus, paymentStatus, userId }) => (
                            <div key={_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                {/* Order Header */}
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID</p>
                                                <p className="font-mono text-sm font-medium text-gray-900">#{_id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            {userId && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Customer</p>
                                                    <p className="text-sm font-medium text-gray-900">{userId.email}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-500">Order Date</p>
                                                <p className="text-sm font-medium text-gray-900">{format(new Date(createdAt), "MMM dd, yyyy")}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <p className="text-sm font-medium text-gray-900">₹{calculateOrderTotal(productIds).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(orderStatus)}`}>
                                                {orderStatus?.toUpperCase() || 'PENDING'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(paymentStatus)}`}>
                                                {paymentStatus?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="px-6 py-4">
                                    {/* Delivery Address */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Delivery Address
                                        </h4>
                                        <p className="text-sm text-gray-600 pl-6 whitespace-pre-line">
                                            {address}
                                        </p>
                                        {contactNumbers && contactNumbers.length > 0 && (
                                            <p className="text-sm text-gray-600 pl-6 mt-1">
                                                Contact: {contactNumbers.join(', ')}
                                            </p>
                                        )}
                                    </div>

                                    {/* Products */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Items ({productIds?.length || 0})
                                        </h4>
                                        <div className="space-y-3 pl-6">
                                            {productIds?.map(({_id: itemId, cartQuantity, price, product}) => (
                                                <div key={itemId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{product?.name || product?.title || 'Product'}</p>
                                                            <p className="text-sm text-gray-500">Quantity: {cartQuantity}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">₹{price?.toLocaleString()}</p>
                                                        <p className="text-sm text-gray-500">per item</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <button 
                                            onClick={() => getOrderPaymentDetails(_id)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span>Refresh Status</span>
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Order Total</p>
                                        <p className="text-lg font-bold text-gray-900">₹{calculateOrderTotal(productIds).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export { OrdersPage };