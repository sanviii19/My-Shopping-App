import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Paginator } from "../../components/paginator";
import { Button } from "../../components/ui/Button";
import { showErrorToast, showSuccessToast } from "../../../utils/toastifyHelper";

const LIMIT_PER_PAGE = 12;

const AdminProductsPage = () => {
    const [query] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Set initial loading to true
    const [updating, setUpdating] = useState(false);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [editProductId, setEditProductId] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [deleting, setDeleting] = useState("");

    const searchText = (query.get("text")) ?? "";

    const getAllProducts = async () => {
        try{
            setLoading(true);
            // API call to get all products based on search text
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products/?q=${searchText}&limit=${LIMIT_PER_PAGE}&page=${page}`, {
                method: "GET",
            });
            const result = await response.json();
            console.log(result);
            setProducts(result.data.products);
            setTotal(result.data.total);
        }
        catch(err){
            showErrorToast("Error fetching products: " + err.message);
        }
        finally{
            setLoading(false);
        }
    }

    // Reset page to 1 when search text changes
    useEffect(() => {
        setPage(1);
    }, [searchText]);

    // Sync search input with URL parameter
    useEffect(() => {
        setSearchInput(searchText);
    }, [searchText]);

    // Fetch products when page changes
    useEffect(() => {
        getAllProducts();
    }, [page, searchText]);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedSearch = searchInput.trim();
        if (trimmedSearch) {
            navigate(`/admin/products?text=${encodeURIComponent(trimmedSearch)}`);
        } else {
            navigate(`/admin/products`);
        }
    };

    const handleClearSearch = () => {
        setSearchInput("");
        navigate(`/admin/products`);
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading products...</p>
                </div>
            </div>
        );
    }
    
    const handleCancelEditing = (e) => {
        e.preventDefault();
        setEditProductId("");
    }

    const updateProduct = async (e) => {
        e.preventDefault();
        // API call to update product details
        const title = e.target.title.value;
        const price = e.target.price.value;
        const quantity = e.target.quantity.value;

        if(title.length < 3) {
            showErrorToast("Title is too short");
            return;
        }

        if(price <= 0) {
            showErrorToast("price must be greater than zero");
            return;
        }

        if(quantity <= 0) {
            showErrorToast("Quantity must be greater than zero");
            return;
        }

        try{
            setUpdating(true);
            // API call to update product
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/products/${editProductId}`, {
                method: "PATCH",
                credentials: "include",
                body: JSON.stringify({title, price, quantity}),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(response.status === 200){
                showSuccessToast("Product Updated!");
                setEditProductId("");
                getAllProducts();
            }else{
                const result = await response.json();
                showErrorToast(result.message);
            }
        }catch(err){
            showErrorToast(`Error updating product: ${err.message}`);
        }finally{
            setUpdating(false);
        }
    }

    const deleteProduct = async (productId, productTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            setDeleting(productId);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/products/${productId}`, {
                method: "DELETE",
                credentials: "include",
            });
            
            if (response.status === 200) {
                showSuccessToast("Product deleted successfully!");
                getAllProducts(); // Refresh the product list
            } else {
                const result = await response.json();
                showErrorToast(result.message || "Failed to delete product");
            }
        } catch (err) {
            showErrorToast(`Error deleting product: ${err.message}`);
        } finally {
            setDeleting("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-6 max-w-7xl mx-auto flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
                        <p className="text-gray-600">Manage and organize your product catalog</p>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>{products.length} products loaded</span>
                            </div>
                            {searchText && (
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Filtered results</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={getAllProducts}
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

                {/* Search and Filters */}
                <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex-1">
                        {/* <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label> */}
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search by product name, SKU, or description..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                                        Enter
                                    </kbd>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </button>
                            {searchText && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Clear
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {searchText && (
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Search Results</h3>
                                    <p className="text-sm text-gray-600">
                                        Found {total} product{total !== 1 ? 's' : ''} matching "<span className="font-semibold text-blue-700">{searchText}</span>"
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClearSearch}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex-1">
                    <div>
                        {products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="mb-6">
                                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5v.01M9 5v.01" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {searchText ? 'No products found' : 'No products available'}
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    {searchText 
                                        ? `No products match your search for "${searchText}". Try different keywords or check your spelling.`
                                        : 'Products will appear here once they are added to the catalog.'
                                    }
                                </p>
                                {searchText && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((elem) => (
                                    <div key={elem._id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden hover:border-gray-300"
                                    >
                                        <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                            <img 
                                                src={elem.images?.[0]} 
                                                alt={elem.title}
                                                className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {elem.quantity <= 0 && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                            {elem.quantity > 0 && elem.quantity <= 5 && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                                        Low Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {
                                            editProductId === elem._id ? (
                                                <form onSubmit={updateProduct} className="p-4 bg-gray-50 space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">Title</label>
                                                        <input 
                                                            type="text" 
                                                            name='title'
                                                            defaultValue={elem.title}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                                        <input 
                                                            type="number" 
                                                            name='price'
                                                            defaultValue={elem.price}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                                        <input 
                                                            type="number" 
                                                            name="quantity"
                                                            defaultValue={elem.quantity}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2 pt-2">
                                                        <Button 
                                                            type="submit" 
                                                            disabled={updating}
                                                            className={`px-4 py-2 rounded-md transition-colors text-white ${
                                                                updating 
                                                                    ? "bg-blue-400 cursor-not-allowed" 
                                                                    : "bg-blue-600 hover:bg-blue-700"
                                                            }`}
                                                        >
                                                            {updating ? "Updating..." : "Update"}
                                                        </Button>
                                                        <Button 
                                                            type="button" 
                                                            onClick={handleCancelEditing}
                                                            disabled={updating}
                                                            className={`px-4 py-2 rounded-md transition-colors text-white ${
                                                                updating 
                                                                    ? "bg-gray-400 cursor-not-allowed" 
                                                                    : "bg-gray-500 hover:bg-gray-600"
                                                            }`}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="p-5">
                                                    <div className="mb-3">
                                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] text-base leading-tight group-hover:text-blue-700 transition-colors">
                                                            {elem.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                            SKU: {elem._id.slice(-8)}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-500 font-medium">Price</span>
                                                            <p className="text-blue-600 font-bold text-lg">₹{elem.price.toLocaleString()}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-500 font-medium">Stock</span>
                                                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                                                                elem.quantity > 5 
                                                                    ? "bg-green-100 text-green-700" 
                                                                    : elem.quantity > 0
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}>
                                                                {elem.quantity > 0 ? `${elem.quantity} units` : "Out of Stock"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div className="p-4 pt-2 bg-gray-50 border-t border-gray-100">
                                            {
                                                editProductId !== elem._id && (
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            onClick={() => setEditProductId(elem._id)}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            onClick={() => deleteProduct(elem._id, elem.title)}
                                                            disabled={deleting === elem._id || updating}
                                                            className={`flex-1 py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2 ${
                                                                deleting === elem._id 
                                                                    ? "bg-red-400 cursor-not-allowed text-white" 
                                                                    : "bg-red-600 hover:bg-red-700 text-white"
                                                            }`}
                                                        >
                                                            {deleting === elem._id ? (
                                                                <>
                                                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                    </svg>
                                                                    Deleting...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Delete
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {products.length > 0 && (
                    <div className="mt-auto">
                        <Paginator total={total} page={page} limit={LIMIT_PER_PAGE} handlePageClick={(val) => {setPage(val)}} />
                    </div>
                )}
            </div>
        </div>
    )
};

export { AdminProductsPage };