import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router";
import { useNavbar } from "./BasicLayout";
import { useState, useEffect } from "react";
import "../components/HomePage.css";
import { showToast, preloadImages, prefersReducedMotion } from "../utils/homepageUtils";
import { useAuthContext } from "../context/AppContext";

const HomePage = () => {
    const navigate = useNavigate();
    const { focusSearchInput } = useNavbar();
    const { setNavigationLoading } = useAuthContext();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Hero carousel slides
    const heroSlides = [
        {
            id: 1,
            title: "Discover Amazing Deals",
            subtitle: "Up to 70% off on trending products",
            bg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center",
            cta: "Shop Now"
        },
        {
            id: 2,
            title: "Premium Electronics",
            subtitle: "Latest smartphones and gadgets",
            bg: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop&crop=center",
            cta: "Explore Tech"
        },
        {
            id: 3,
            title: "Fashion Forward",
            subtitle: "Trendy outfits for every occasion",
            bg: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop&crop=center",
            cta: "Browse Fashion"
        }
    ];

    const categories = [
        { 
            name: "Electronics", 
            searchTerm: "phone",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop",
            color: "from-blue-500 to-blue-600"
        },
        { 
            name: "Fashion", 
            searchTerm: "fashion",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
            color: "from-pink-500 to-rose-600"
        },
        { 
            name: "Home & Living", 
            searchTerm: "home",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
            color: "from-green-500 to-emerald-600"
        },
        { 
            name: "Sports", 
            searchTerm: "sports",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
            color: "from-orange-500 to-red-600"
        },
        { 
            name: "Books", 
            searchTerm: "tablet",
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
            color: "from-purple-500 to-indigo-600"
        },
        { 
            name: "Beauty", 
            searchTerm: "makeup",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop",
            color: "from-pink-400 to-purple-500"
        }
    ];



    // Auto-slide effect for hero carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Scroll reveal animation
    useEffect(() => {
        // Skip animations if user prefers reduced motion
        if (prefersReducedMotion()) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        const scrollElements = document.querySelectorAll('.scroll-reveal');
        scrollElements.forEach(el => observer.observe(el));

        return () => {
            scrollElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    // Preload hero images for better performance
    useEffect(() => {
        const heroImages = heroSlides.map(slide => slide.bg);
        preloadImages(heroImages);
    }, []);



    const handleCategoryClick = (category) => {
        setNavigationLoading(true);
        // Use searchTerm if available, otherwise fall back to category name
        const searchQuery = category.searchTerm || category.name.toLowerCase();
        navigate(`/search?text=${searchQuery}&category=${encodeURIComponent(category.name)}`);
        // Reset navigation loading after a short delay to ensure smooth transition
        setTimeout(() => {
            setNavigationLoading(false);
        }, 300);
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            setNavigationLoading(true);
            navigate(`/search?text=${searchText.trim()}`);
            // Reset navigation loading after a short delay to ensure smooth transition
            setTimeout(() => {
                setNavigationLoading(false);
            }, 300);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Carousel Section */}
            <div className="-mt-2 relative h-[70vh] overflow-hidden">
                {heroSlides.map((slide, index) => (
                    <div 
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div 
                            className="w-full h-full bg-cover bg-center relative"
                            style={{ backgroundImage: `url(${slide.bg})` }}
                        >
                            <div className="absolute inset-0 bg-black/40"></div>
                            <div className="relative h-full flex items-center justify-center">
                                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                                    <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-xl md:text-2xl mb-8 text-gray-200">
                                        {slide.subtitle}
                                    </p>
                                    <button 
                                        onClick={focusSearchInput}
                                        className="btn-hover bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg focus-ring"
                                    >
                                        {slide.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Carousel Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                    ? 'bg-white scale-125' 
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 scroll-reveal">
                        <div className="inline-block">
                            <h2 className="text-4xl font-bold text-blue-600 mb-2">Shop by Category</h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto mb-4"></div>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Browse our curated selection across popular categories
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-reveal">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => handleCategoryClick(category)}
                                className="group cursor-pointer category-card"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 will-change-transform bg-white">
                                    <div className="aspect-[4/3] relative">
                                        <img 
                                            src={category.image} 
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-50 transition-all duration-300`}></div>
                                        
                                        {/* Category content */}
                                        <div className="absolute inset-0 flex items-end p-6">
                                            <div className="text-left transform group-hover:translate-y-[-4px] transition-transform duration-300">
                                                <h3 className="text-white font-bold text-2xl drop-shadow-lg mb-2">
                                                    {category.name}
                                                </h3>
                                                <div className="flex items-center text-white/90 group-hover:text-white transition-colors duration-300">
                                                    <span className="text-sm font-medium">Shop Now</span>
                                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional hover border effect */}
                                        <div className="absolute inset-0 border-2 border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Trust Indicators */}
            <div className="py-12 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 scroll-reveal">
                        <div className="inline-block">
                            <h2 className="text-4xl font-bold text-blue-600 mb-2">Why Choose Us</h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto mb-4"></div>
                        </div>
                        <p className="text-lg text-gray-600">
                            Trusted by thousands of customers worldwide
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 scroll-reveal">
                        <div className="flex flex-col items-center text-center trust-indicator group bg-white rounded-lg p-6 hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 icon-bg group-hover:bg-green-200 transition-colors duration-200">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">Verified Products</h3>
                            <p className="text-sm text-gray-600">100% authentic items from authorized dealers</p>
                        </div>
                        <div className="flex flex-col items-center text-center trust-indicator group bg-white rounded-lg p-6 hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 icon-bg group-hover:bg-blue-200 transition-colors duration-200">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">Free Shipping</h3>
                            <p className="text-sm text-gray-600">Fast delivery on orders over $50</p>
                        </div>
                        <div className="flex flex-col items-center text-center trust-indicator group bg-white rounded-lg p-6 hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 icon-bg group-hover:bg-purple-200 transition-colors duration-200">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">Secure Payment</h3>
                            <p className="text-sm text-gray-600">Bank-level SSL encryption</p>
                        </div>
                        <div className="flex flex-col items-center text-center trust-indicator group bg-white rounded-lg p-6 hover:shadow-md transition-all duration-200">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 icon-bg group-hover:bg-orange-200 transition-colors duration-200">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">24/7 Support</h3>
                            <p className="text-sm text-gray-600">Always here to help you</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
};

export { HomePage };