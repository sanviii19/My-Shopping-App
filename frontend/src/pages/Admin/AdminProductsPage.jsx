import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Paginator } from "../../components/paginator";
import { GridLoader } from "react-spinners";
import { Button } from "../../components/ui/Button";
import { showErrorToast, showSuccessToast } from "../../../utils/toastifyHelper";

const LIMIT_PER_PAGE = 12;

const AdminProductsPage = () => {
    const [query] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [editProductId, setEditProductId] = useState("");
    // const Navigate = useNavigate();

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
            alert("Error fetching products");
        }
        finally{
            setLoading(false);
        }
    }

    // Reset page to 1 when search text changes
    useEffect(() => {
        setPage(1);
    }, [searchText]);

    // Fetch products when page changes
    useEffect(() => {
        getAllProducts();
    }, [page, searchText]);
    
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="pt-28 pb-8 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto flex-1 flex flex-col">
                {searchText && (
                    <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h2 className="text-xl text-gray-700 flex items-center">
                            <span className="mr-2">🔍</span>
                            Search results for: <span className="font-semibold text-blue-600 ml-1">{searchText}</span>
                        </h2>
                    </div>
                )}
                <div className="flex-1">{ loading ? (
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">  
                        <GridLoader color="#2563eb" size={20} />
                    </div>
                ) : (
                    <div>
                        {products.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="text-6xl mb-4">📦</div>
                                <p className="text-gray-600 text-lg font-medium">
                                    No products found {searchText && <span>for "<span className="text-blue-600 font-semibold">{searchText}</span>"</span>}
                                </p>
                                <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {products.map((elem) => (
                                    <div key={elem._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                                    >
                                        <div className="relative w-full h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                            <img 
                                                src={elem.images?.[0]} 
                                                alt={elem.title}
                                                className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                                            />
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
                                                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem] text-base leading-tight">
                                                        {elem.title}
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-500 font-medium">Price</span>
                                                            <p className="text-blue-600 font-bold text-lg">₹{elem.price}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-500 font-medium">Stock</span>
                                                            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                                                                elem.quantity > 0 
                                                                    ? "bg-green-100 text-green-700" 
                                                                    : "bg-red-100 text-red-700"
                                                            }`}>
                                                                {elem.quantity > 0 ? `${elem.quantity} units` : "Out of Stock"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div className="p-4 pt-2 flex gap-3">
                                            {
                                                editProductId !== elem._id && (
                                                    <>
                                                        <Button 
                                                            onClick={() => setEditProductId(elem._id)}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium">
                                                            Delete
                                                        </Button>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
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