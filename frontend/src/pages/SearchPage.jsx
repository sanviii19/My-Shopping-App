import { useNavigate, useSearchParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { useEffect } from "react";
import { GridLoader } from "react-spinners";
import { useState } from "react";
import { Paginator } from "../components/paginator";

const LIMIT_PER_PAGE = 10;

const SearchPage = () => {
    const [query] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const Navigate = useNavigate();

    const searchText = (query.get("text"));
    const categoryName = query.get("category");

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
    
    const handleViewProduct = (id) => {
        Navigate(`/view/${id}`);
    }
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col">
                {searchText && !categoryName && (
                    <div className="mb-6">
                        <h2 className="text-xl text-gray-700">
                            Search results for: <span className="font-semibold text-blue-600">{searchText}</span>
                        </h2>
                    </div>
                )}
                {categoryName && (
                    <div className="mb-8 mt-2">
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                {categoryName}
                            </h1>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                            <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            <p className="text-gray-600 text-sm font-medium">Explore our collection</p>
                        </div>
                    </div>
                )}
                <div className="flex-1">{ loading ? (
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">  
                        <GridLoader color="#2563eb" size={20} />
                    </div>
                ) : (
                    <div>
                        {products.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-600 text-lg">
                                    {categoryName ? (
                                        <>No products found in {categoryName} category</>
                                    ) : (
                                        <>No results found {searchText && <span>for "<span className="text-blue-600">{searchText}</span>"</span>}</>
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {products.map((elem) => (
                                    <div key={elem._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 scale-100 hover:scale-[1.02] transform"
                                        role="button"
                                        onClick={() => handleViewProduct(elem._id)}
                                    >
                                        <div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                                            <img 
                                                src={elem.images?.[0]} 
                                                alt={elem.title}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                                                {elem.title}
                                            </h3>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-blue-600 font-bold text-lg">₹{elem.price}</p>
                                                <p className="text-sm px-2 py-1 rounded-full bg-gray-100">
                                                    <span className={elem.quantity > 0 ? "text-green-600" : "text-red-600"}>
                                                        {elem.quantity > 0 ? `In Stock : ${elem.quantity}` : "Out of Stock"}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                </div>
                {products.length > 0 && (
                    <div className="mt-auto pt-8 pb-4">
                        <Paginator total={total} page={page} limit={LIMIT_PER_PAGE} handlePageClick={(val) => {setPage(val)}} />
                    </div>
                )}
            </div>
        </div>
    )
};

export { SearchPage };