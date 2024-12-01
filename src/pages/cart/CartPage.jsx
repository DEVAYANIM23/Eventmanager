import { useSelector, useDispatch } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash } from 'lucide-react';
import { clearCart } from "../../redux/cartSlice"; // Import clearCart
import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import PaymentModal from "../../components/buyNowModal/PaymentModal";

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const openPaymentModal = () => {
        setPaymentModalOpen(true);
    };

    const cartTotal = cartItems.map(item => item.price * item.quantity).reduce((prevValue, currValue) => prevValue + currValue, 0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const user = JSON.parse(localStorage.getItem('users'));

    const buyNowFunction = () => {
        const orderInfo = {
            cartItems,
            email: user.email,
            userid: user.uid,
            status: "confirmed",
            time: new Date().toLocaleString(),
            date: new Date().toLocaleString(),
        };

        try {
            // Your firebase order save logic here
            setPaymentSuccess(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 max-w-7xl lg:px-0">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Price Details</h1>
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
                    >
                        <h2
                            id="summary-heading"
                            className=" border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
                        >
                            Price Details
                        </h2>
                        <div>
                            <dl className="space-y-1 px-2 py-4">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-800">Total</dt>
                                    <dd className="text-sm font-medium text-gray-900">
                                        ₹{cartTotal}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <button
                            onClick={openPaymentModal}
                            className="flex w-full justify-center rounded-md bg-indigo-600 py-3 px-4 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Book Now
                        </button>
                    </section>
                </div>
            </div>

            {paymentModalOpen && (
                <PaymentModal
                    open={paymentModalOpen}
                    onClose={() => setPaymentModalOpen(false)}
                    onPay={buyNowFunction}
                />
            )}
            {paymentSuccess && <Navigate to="/thank-you" />}
        </Layout>
    );
};

export default CartPage;
