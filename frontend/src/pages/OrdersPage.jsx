import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";
import { format } from "date-fns";
import { Button } from "../components/ui/Button";

const OrdersPage = () => {
     const [orders, setOrders] = useState([]); 
    const getAllOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/orders`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            if (response.status === 200) {
                setOrders(data.data.orders)
                console.log(data);
            } else {
                showErrorToast(data.message);
            }
        } catch (error) {
            showErrorToast(error.message);
        }
    };

    const getOrderPaymentDetails = async (orderId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/payment-status`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (response.status == 200) {
                showSuccessToast("Payment Details Fetched");
                getAllOrders();
            } else {
                showErrorToast(result.message);
            }
        } catch (err) {
            showErrorToast(err.message);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);

    return <div>
        <div className="p-4"> 
            <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
            <div>
                {
                    orders?.map(({_id, streetAddress, createdAt, products, user, contactNumbers, orderStatus, paymentStatus }) => {
                        return <div key={_id} className="border p-4 mb-4 rounded">
                            <p>User Id: {_id}</p>
                            <p>Address: {streetAddress}</p>
                            <p>Created At: {format(new Date(createdAt), "PPpp")}</p>
                            <p>User Email: {user?.email}</p>
                            <p>Contact Numbers: {contactNumbers.join(", ")}</p>
                            <p className="py-4">Order Status: {orderStatus}</p>
                            <p>Payment Status: {paymentStatus}</p>
                            <Button onClick={() => getOrderPaymentDetails(_id)}>Refresh</Button>
                            <div>
                                <h3 className="font-semibold mt-2">Products:</h3>
                                {
                                    products?.map(({_id:itemId, cartQuantity, price, product}) => {
                                        return (
                                            <div key={itemId} className="border p-2 my-2 rounded">
                                                <p>Product Name: {product.name}</p>
                                                <p>Quantity: {cartQuantity}</p>
                                                <p>Price: ${price}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }) 
                }
            </div>
        </div>
    </div>
}

export { OrdersPage };