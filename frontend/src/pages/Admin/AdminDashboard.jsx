import { useEffect, useState } from "react";
import { Link } from "react-router";
import { showErrorToast } from "../../../utils/toastifyHelper";

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0,
        recentOrders: [],
        ordersByStatus: {},
        loading: true
    });

    const fetchDashboardData = async () => {
        try {
            setDashboardData(prev => ({ ...prev, loading: true }));
            
            // Fetch orders and products data
            const [ordersResponse, productsResponse] = await Promise.all([
                fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/orders`, {
                    method: "GET",
                    credentials: "include"
                }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/products?limit=1000`, {
                    method: "GET",
                    credentials: "include"
                })
            ]);

            const ordersData = await ordersResponse.json();
            const productsData = await productsResponse.json();

            if (ordersResponse.status === 200 && productsResponse.status === 200) {
                const orders = ordersData.data.orders || [];
                const products = productsData.data.products || [];
                
                // Calculate statistics
                const totalOrders = orders.length;
                const totalProducts = products.length;
                const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;
                
                // Recent orders (last 5)
                const recentOrders = orders
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);

                // Orders by status
                const ordersByStatus = orders.reduce((acc, order) => {
                    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
                    return acc;
                }, {});

                setDashboardData({
                    totalOrders,
                    totalProducts,
                    pendingOrders,
                    recentOrders,
                    ordersByStatus,
                    loading: false
                });
            } else {
                showErrorToast("Failed to fetch dashboard data");
                setDashboardData(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
            showErrorToast("Error loading dashboard");
            setDashboardData(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon, color, link }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    {link && (
                        <Link to={link} className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
                            View all →
                        </Link>
                    )}
                </div>
                <div className={`text-3xl ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const QuickActionCard = ({ title, description, link, icon, color }) => (
        <Link 
            to={link} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-300 block"
        >
            <div className="flex items-center mb-3">
                <div className={`text-2xl ${color} mr-3`}>
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{description}</p>
        </Link>
    );

    if (dashboardData.loading) {
        return (
            <div className="p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    disabled={dashboardData.loading}
                    className="bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 disabled:text-gray-400 border border-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:border-gray-400 shadow-sm"
                >
                    <svg 
                        className={`w-4 h-4 ${dashboardData.loading ? 'animate-spin' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-sm font-medium">{dashboardData.loading ? 'Refreshing...' : 'Refresh'}</span>
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Orders"
                    value={dashboardData.totalOrders}
                    icon="📦"
                    color="text-blue-600"
                    link="/admin/orders"
                />
                <StatCard
                    title="Total Products"
                    value={dashboardData.totalProducts}
                    icon="🛍️"
                    color="text-green-600"
                    link="/admin/products"
                />
                <StatCard
                    title="Pending Orders"
                    value={dashboardData.pendingOrders}
                    icon="⏳"
                    color="text-orange-600"
                    link="/admin/orders"
                />
                <StatCard
                    title="Order Status"
                    value={Object.keys(dashboardData.ordersByStatus).length}
                    icon="📊"
                    color="text-purple-600"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">
                                View all →
                            </Link>
                        </div>
                    </div>
                    <div className="p-6">
                        {dashboardData.recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardData.recentOrders.map((order, index) => (
                                    <div key={order._id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">Order #{order._id?.slice(-8) || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">
                                                {order.productIds?.length || 0} items • {order.address || 'No address'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.orderStatus === 'pending' 
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : order.orderStatus === 'In progress'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {order.orderStatus || 'Unknown'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.paymentStatus === 'SUCCESS'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.paymentStatus === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {order.paymentStatus || 'INITIALIZED'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No orders found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Order Status</h2>
                    </div>
                    <div className="p-6">
                        {Object.keys(dashboardData.ordersByStatus).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(dashboardData.ordersByStatus).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-3 ${
                                                status === 'pending' 
                                                    ? 'bg-orange-400'
                                                    : status === 'In progress'
                                                    ? 'bg-blue-400'
                                                    : 'bg-red-400'
                                            }`}></div>
                                            <span className="text-gray-700 capitalize">{status}</span>
                                        </div>
                                        <span className="font-semibold text-gray-800">{count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No order data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Manage Orders"
                        description="View and update order status, payment details"
                        link="/admin/orders"
                        icon="📋"
                        color="text-blue-600"
                    />
                    <QuickActionCard
                        title="Manage Products"
                        description="Add, edit, and organize your product catalog"
                        link="/admin/products"
                        icon="🎁"
                        color="text-green-600"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">System Status</h3>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-green-600 font-medium">All systems operational</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Last updated: {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export { AdminDashboard };