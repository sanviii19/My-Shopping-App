import { showErrorToast, showSuccessToast } from "../../../utils/toastifyHelper";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "../../components/ui/Button";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        paymentStatus: 'all',
        search: ''
    });
    const [sortBy, setSortBy] = useState('newest');

    const getAllOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/orders`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            if (response.status === 200) {
                setOrders(data.data.orders);
                setFilteredOrders(data.data.orders);
                console.log(data);
            } else {
                showErrorToast(data.message);
            }
        } catch (error) {
            showErrorToast(error.message);
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
            if (response.status === 200) {
                showSuccessToast("Payment Details Refreshed");
                getAllOrders();
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(err.message);
        }
    };

    // Filter and sort orders
    useEffect(() => {
        let filtered = [...orders];

        // Apply filters
        if (filters.status !== 'all') {
            filtered = filtered.filter(order => order.orderStatus === filters.status);
        }
        if (filters.paymentStatus !== 'all') {
            filtered = filtered.filter(order => order.paymentStatus === filters.paymentStatus);
        }
        if (filters.search) {
            filtered = filtered.filter(order => 
                order._id.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.address?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'amount-high':
                    return (b.products?.reduce((sum, p) => sum + (p.price * p.cartQuantity), 0) || 0) - 
                           (a.products?.reduce((sum, p) => sum + (p.price * p.cartQuantity), 0) || 0);
                case 'amount-low':
                    return (a.products?.reduce((sum, p) => sum + (p.price * p.cartQuantity), 0) || 0) - 
                           (b.products?.reduce((sum, p) => sum + (p.price * p.cartQuantity), 0) || 0);
                default:
                    return 0;
            }
        });

        setFilteredOrders(filtered);
    }, [orders, filters, sortBy]);

    useEffect(() => {
        getAllOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'In progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'FAILED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const calculateOrderTotal = (products) => {
        return products?.reduce((sum, product) => sum + (product.price * product.cartQuantity), 0) || 0;
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Orders Management</h1>
                    <p className="text-gray-600">Manage and track all customer orders</p>
                </div>
                <button
                    onClick={getAllOrders}
                    disabled={loading}
                    className="bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 disabled:text-gray-400 border border-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:border-gray-400 shadow-sm"
                >
                    <svg 
                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm font-medium">{loading ? 'Refreshing...' : 'Refresh'}</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">📦</div>
                        <div>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">⏳</div>
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {orders.filter(o => o.orderStatus === 'pending').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">🔄</div>
                        <div>
                            <p className="text-sm text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {orders.filter(o => o.orderStatus === 'In progress').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="text-2xl mr-3">✅</div>
                        <div>
                            <p className="text-sm text-gray-600">Paid Orders</p>
                            <p className="text-2xl font-bold text-green-600">
                                {orders.filter(o => o.paymentStatus === 'SUCCESS').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Email, or Address"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="In progress">In Progress</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <select
                            value={filters.paymentStatus}
                            onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Payment Status</option>
                            <option value="SUCCESS">Success</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="INITIALIZED">Initialized</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="amount-high">Highest Amount</option>
                            <option value="amount-low">Lowest Amount</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Orders ({filteredOrders.length})
                    </h2>
                </div>
                
                {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-4xl mb-4">📦</div>
                        <p className="text-gray-500 text-lg">No orders found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Order Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                Order #{order._id.slice(-8)}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Customer:</span> {order.user?.email || 'N/A'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Date:</span> {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                            </div>
                                            <div>
                                                <span className="font-medium">Items:</span> {order.products?.length || 0}
                                            </div>
                                            <div>
                                                <span className="font-medium">Total:</span> ${calculateOrderTotal(order.products).toFixed(2)}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-2 text-sm text-gray-600">
                                            <span className="font-medium">Address:</span> {order.address}
                                        </div>
                                        
                                        {order.contactNumbers?.length > 0 && (
                                            <div className="mt-1 text-sm text-gray-600">
                                                <span className="font-medium">Contact:</span> {order.contactNumbers.join(", ")}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                                        </button>
                                        <button
                                            onClick={() => getOrderPaymentDetails(order._id)}
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            Refresh Payment
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {selectedOrder === order._id && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Products */}
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-3">Products</h4>
                                                <div className="space-y-2">
                                                    {order.products?.map((item, index) => (
                                                        <div key={item._id || index} className="bg-gray-50 rounded-lg p-3">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-800">{item.product?.name || 'Product Name N/A'}</p>
                                                                    <p className="text-sm text-gray-600">Quantity: {item.cartQuantity}</p>
                                                                    <p className="text-sm text-gray-600">Unit Price: ${item.price}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-gray-800">
                                                                        ${(item.price * item.cartQuantity).toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Payment Details */}
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-3">Payment Information</h4>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Payment Status:</span>
                                                            <span className={`font-medium ${
                                                                order.paymentStatus === 'SUCCESS' ? 'text-green-600' : 
                                                                order.paymentStatus === 'PENDING' ? 'text-yellow-600' : 
                                                                'text-red-600'
                                                            }`}>
                                                                {order.paymentStatus}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Order Total:</span>
                                                            <span className="font-semibold">${calculateOrderTotal(order.products).toFixed(2)}</span>
                                                        </div>
                                                        {order.paymentSessionId && (
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Session ID:</span>
                                                                <span className="font-mono text-xs">{order.paymentSessionId}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {order.paymentDetails && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                            <p className="text-xs text-gray-500 mb-2">Payment Details:</p>
                                                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                                                                {JSON.stringify(order.paymentDetails, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export { AdminOrdersPage };