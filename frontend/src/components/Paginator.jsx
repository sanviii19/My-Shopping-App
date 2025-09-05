const Paginator = ({ total, limit, page, handlePageClick}) => {
    const totalpages = Math.ceil(total / limit);
    const dummyArr = new Array(totalpages).fill(0);

    if (totalpages <= 1) return null; // Don't show paginator for single page

    return (
        <div className="flex justify-center items-center mt-8 mb-6">
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md p-2 border border-gray-200 h-12">
                {/* Previous Button */}
                {page > 1 && (
                    <button 
                        className="px-2 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-200 font-medium text-sm h-8 flex items-center"
                        onClick={() => handlePageClick(page - 1)}
                    >
                        ← Prev
                    </button>
                )}
                
                {/* Page Numbers */}
                {dummyArr.map((elem, index) => {
                    const pageNumber = index + 1;
                    const selected = pageNumber === page;
                    return (
                        <button 
                            key={index} 
                            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105 h-8 flex items-center justify-center min-w-[32px] ${
                                selected 
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                                    : "text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                            }`}
                            onClick={() => handlePageClick(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
                
                {/* Next Button */}
                {page < totalpages && (
                    <button 
                        className="px-2 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-200 font-medium text-sm h-8 flex items-center"
                        onClick={() => handlePageClick(page + 1)}
                    >
                        Next →
                    </button>
                )}
            </div>
        </div>
    );

}

export { Paginator };