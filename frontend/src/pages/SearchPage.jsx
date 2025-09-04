import { useSearchParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { useEffect } from "react";
import { GridLoader } from "react-spinners";
import { useState } from "react";

const SearchPage = () => {
    const [query] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const searchText = (query.get("text"));

    const getAllProducts = async () => {
        try{
            setLoading(true);
            // API call to get all products based on search text
            const response = await fetch(`http://localhost:3900/api/v1/products/?q=${searchText}`, {
                method: "GET",
            });
            const result = await response.json();
            console.log(result);
            setProducts(result.data.products);
        }
        catch(err){
            alert("Error fetching products");
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllProducts();
    }, [searchText]);
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {searchText && (
                    <div className="mb-6">
                        <h2 className="text-xl text-gray-700">
                            Search results for: <span className="font-semibold text-blue-600">{searchText}</span>
                        </h2>
                    </div>
                )}
                <div>{ loading ? (
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">  
                        <GridLoader color="#2563eb" size={20} />
                    </div>
                ) : (
                    <div>
                        {products.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-600 text-lg">
                                    No results found {searchText && <span>for "<span className="text-blue-600">{searchText}</span>"</span>}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((elem) => (
                                    <div key={elem._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                        <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                                            <img 
                                                src={elem.images?.[0]} 
                                                alt={elem.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
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
            </div>
        </div>
    )
};

export { SearchPage };