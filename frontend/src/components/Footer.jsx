import { useState } from "react";
import { useAuthContext } from "../context/AppContext";

const Footer = () => {
    const [email, setEmail] = useState("");
    const { appLoading, navigationLoading } = useAuthContext();

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email && /\S+@\S+\.\S+/.test(email)) {
            // Handle newsletter signup
            console.log("Newsletter signup:", email);
            setEmail("");
            // You can add toast notification here
        }
    };

    const currentYear = new Date().getFullYear();

    // Don't render footer while app is loading or during navigation
    if (appLoading || navigationLoading) {
        return null;
    }

    return (
        <footer className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 text-white border-t border-gray-600">
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* SHOP Section */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">SHOP</h4>
                        </div>
                        <ul className="space-y-3">
                            <li><a href="/search?text=smartphones" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Smartphones</a></li>
                            <li><a href="/search?text=laptops" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Laptops</a></li>
                            <li><a href="/search?text=mobile-accessories" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Mobile Accessories</a></li>
                            <li><a href="/search?text=womens-shoes" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Women's Shoes</a></li>
                            <li><a href="/search?text=mens-shoes" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Men's Shoes</a></li>
                            <li><a href="/search?text=sunglasses" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Sunglasses</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Gift Cards</a></li>
                        </ul>
                    </div>
                    {/* POPULAR Section */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">POPULAR</h4>
                        </div>
                        <ul className="space-y-3">
                            <li><a href="/search?text=womens-bags" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Women's Bags</a></li>
                            <li><a href="/search?text=womens-dresses" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Women's Dresses</a></li>
                            <li><a href="/search?text=mens-shirts" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Men's Shirts</a></li>
                            <li><a href="/search?text=sports-accessories" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Sports Accessories</a></li>
                        </ul>
                    </div>

                    {/* SUPPORT Section */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">SUPPORT</h4>
                        </div>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contact Us</a></li>
                            <li><a href="/account" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Account</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Store Locations</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Shipping And Delivery</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Returns</a></li>
                        </ul>
                    </div>

                    {/* INFO Section */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">INFO</h4>
                        </div>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">About</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Career</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Sustainability</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Investor Relations</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Press</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Payment Methods and Social Media Section */}
            <div className="border-t border-gray-500 bg-gray-600/50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-16">
                        {/* Payment Methods */}
                        <div className="flex items-center space-x-4">
                            {/* VISA */}
                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">VISA</span>
                            </div>
                            {/* Apple Pay */}
                            <div className="w-12 h-8 bg-black rounded flex items-center justify-center">
                                <svg className="w-6 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7.078 23.55c-.473-.316-.893-.703-1.244-1.15-.383-.463-.738-.95-1.064-1.454-.766-1.12-1.365-2.345-1.78-3.636-.5-1.502-.743-2.94-.743-4.347 0-1.57.34-2.94 1.002-4.09.49-.9 1.22-1.653 2.1-2.182.85-.53 1.79-.84 2.77-.84.35 0 .73.05 1.13.15.29.08.64.21 1.07.37.55.2.94.33 1.17.38.34.05.68.08 1.02.08.3 0 .62-.03.95-.08.37-.05.8-.18 1.3-.37.42-.16.77-.29 1.05-.37.42-.1.82-.15 1.18-.15 1.02 0 1.96.31 2.83.94.75.54 1.3 1.04 1.65 1.49-.71.71-1.25 1.49-1.6 2.36-.48 1.18-.73 2.51-.73 3.97 0 1.42.23 2.68.71 3.79.47 1.07 1.07 1.97 1.8 2.69-.37.12-.8.26-1.3.42-1.18.38-2.35.57-3.5.57-.76 0-1.51-.09-2.25-.27-.85-.2-1.6-.49-2.25-.85-.65-.35-1.19-.71-1.63-1.09-.44-.37-.78-.74-1.02-1.09-.24-.35-.4-.66-.48-.92-.08-.26-.12-.49-.12-.68 0-.26.05-.53.16-.82.11-.28.27-.54.49-.77.21-.23.48-.42.79-.57.31-.15.65-.23 1.01-.23.18 0 .37.02.56.07.2.05.38.11.54.2.16.08.3.18.42.29.12.11.21.23.27.36.06.13.09.27.09.42 0 .19-.04.37-.13.54-.08.17-.2.32-.35.45-.15.13-.32.23-.51.3-.19.07-.39.11-.59.11-.1 0-.2-.01-.29-.02-.09-.02-.18-.04-.26-.07-.08-.03-.15-.07-.22-.11-.07-.04-.13-.09-.18-.15-.05-.06-.09-.12-.11-.19-.02-.07-.03-.14-.03-.22 0-.1.02-.2.07-.29.05-.09.11-.17.19-.23.08-.06.17-.11.27-.14.1-.03.2-.05.31-.05.07 0 .14.01.2.02.06.02.12.04.17.07.05.03.09.07.12.11.03.04.05.09.05.14 0 .04-.01.08-.03.12-.02.04-.05.07-.08.1-.03.03-.07.05-.11.06-.04.01-.08.02-.12.02-.02 0-.04 0-.06-.01-.02 0-.04-.01-.05-.02-.01-.01-.02-.02-.03-.03-.01-.01-.01-.02-.01-.03 0-.01 0-.02.01-.03.01-.01.02-.02.03-.02.01 0 .02-.01.03-.01.01 0 .02 0 .03.01.01.01.02.02.02.03 0 .01 0 .02-.01.03-.01.01-.02.01-.03.02-.01 0-.02 0-.03 0-.01 0-.02 0-.03-.01-.01 0-.02-.01-.02-.02-.01-.01-.01-.02-.01-.03 0-.01.01-.02.02-.02.01-.01.02-.01.03-.01.01 0 .02 0 .02.01.01.01.01.02.01.03 0 .01-.01.02-.02.03-.01.01-.02.01-.03.01h-.03c-.01 0-.02-.01-.02-.02 0-.01-.01-.02-.01-.03 0-.01.01-.02.02-.03.01 0 .02-.01.03-.01.01 0 .02.01.03.02.01.01.01.02.01.03 0 .01-.01.02-.02.02-.01.01-.02.01-.03.01-.01 0-.02 0-.03-.01-.01-.01-.01-.02-.01-.03 0-.01.01-.02.02-.02.01-.01.02-.01.03-.01.01 0 .02.01.02.02.01.01.01.02.01.03 0 .01-.01.02-.02.02-.01.01-.02.01-.03.01h-.02c-.01 0-.02-.01-.02-.02-.01-.01-.01-.02-.01-.03 0-.01.01-.02.02-.02.01-.01.02-.01.03-.01.01 0 .02.01.02.02.01.01.01.02.01.03 0 .01-.01.02-.02.02-.01.01-.02.01-.03.01z"/>
                                </svg>
                            </div>
                            {/* Google Pay */}
                            <div className="w-12 h-8 bg-white border border-gray-300 rounded flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-800">G Pay</span>
                            </div>
                            {/* Klarna */}
                            <div className="w-12 h-8 bg-pink-500 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">K</span>
                            </div>
                            {/* Mastercard */}
                            <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">MC</span>
                            </div>
                            {/* PayPal */}
                            <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">PP</span>
                            </div>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Facebook */}
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 group">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-300 group">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.1.12.112.225.085.345-.09.375-.299 1.194-.24 1.363.08.225.402.306.402.306.402-.225 2.146-1.275 2.146-1.275 1.194-1.619 1.194-1.619 1.194-1.619z"/>
                                </svg>
                            </a>
                            {/* Pinterest */}
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300 group">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.1.12.112.225.085.345-.09.375-.299 1.194-.24 1.363.08.225.402.306.402.306.402-.225 2.146-1.275 2.146-1.275 1.194-1.619 1.194-1.619 1.194-1.619z"/>
                                </svg>
                            </a>
                            {/* TikTok */}
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-black transition-colors duration-300 group">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Section */}
            <div className="border-t border-gray-500 bg-gray-700 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-gray-300 text-sm">
                                © {currentYear} myshoppingapp. All rights reserved.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Cookies</a>
                            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Privacy Policy</a>
                            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Terms and Conditions</a>
                            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Sitemap</a>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                            Denmark
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { Footer };