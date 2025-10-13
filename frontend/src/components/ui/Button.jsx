const Button = ({ children, className = "", onClick, disabled = false, type = "button", size = "default", variant = "default", ...props }) => {
    const sizeClasses = {
        sm: "px-2 py-1 text-sm",
        default: "p-3",
        lg: "px-6 py-4 text-lg"
    };

    const variantClasses = {
        default: "bg-blue-500 hover:bg-blue-600 text-white",
        outline: "border border-blue-500 text-blue-500 hover:bg-blue-50 bg-white"
    };

    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button 
            type={type}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} rounded-md font-medium transition-colors duration-200 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export { Button };