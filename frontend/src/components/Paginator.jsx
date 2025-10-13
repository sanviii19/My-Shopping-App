const Paginator = ({ total, limit, page, handlePageClick}) => {
    const totalpages = Math.ceil(total / limit);

    if (totalpages <= 1) return null; // Don't show paginator for single page

    // Generate smart pagination numbers
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];

        // Always include first page
        range.push(1);

        // Add pages around current page
        for (let i = Math.max(2, page - delta); i <= Math.min(totalpages - 1, page + delta); i++) {
            range.push(i);
        }

        // Always include last page if more than 1 page
        if (totalpages > 1) {
            range.push(totalpages);
        }

        let prev = 0;
        for (let i of range) {
            if (prev + 1 < i) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            prev = i;
        }

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

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
                {pageNumbers.map((pageNumber, index) => {
                    if (pageNumber === '...') {
                        return (
                            <span 
                                key={`ellipsis-${index}`} 
                                className="px-2 py-2 text-gray-400 h-8 flex items-center justify-center"
                            >
                                ...
                            </span>
                        );
                    }

                    const selected = pageNumber === page;
                    return (
                        <button 
                            key={pageNumber} 
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