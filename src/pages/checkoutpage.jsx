import { useState } from "react";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { fireDB } from "./FirebaseConfig";
import { Navigate } from "react-router";
import BuyNowModal from "../buyNowModal/BuyNowModal";
import PaymentModal from "../buyNowModal/PaymentModal";

const CheckoutPage = () => {
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [addressInfo, setAddressInfo] = useState({
        name: "",
        address: "",
        pincode: "",
        mobileNumber: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    });

    const user = JSON.parse(localStorage.getItem('users'));

    // Handle payment success
    const handlePaymentSuccess = () => {
        // Simulate order placement and update order details
        const orderInfo = {
            addressInfo,
            email: user.email,
            userid: user.uid,
            status: "confirmed",
            time: Timestamp.now(),
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        };

        try {
            const orderRef = collection(fireDB, 'order');
            addDoc(orderRef, orderInfo);
            setPaymentSuccess(true);
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    // Handle payment failure
    const handlePaymentFailure = () => {
        setPaymentSuccess(false); // Reset to failure state
        console.log("Payment failed. Please try again.");
    };

    // Open Payment Modal
    const openPaymentModal = () => {
        setPaymentModalOpen(true);
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 max-w-7xl lg:px-0">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Checkout
                    </h1>
                    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        <section aria-labelledby="address-heading" className="rounded-lg bg-white lg:col-span-8">
                            <h2 id="address-heading" className="sr-only">
                                Shipping Address
                            </h2>
                            <div className="space-y-4 px-6 py-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={addressInfo.name}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                />

                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    value={addressInfo.address}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, address: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                />

                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    value={addressInfo.pincode}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, pincode: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                />

                                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                <input
                                    type="text"
                                    id="mobileNumber"
                                    value={addressInfo.mobileNumber}
                                    onChange={(e) => setAddressInfo({ ...addressInfo, mobileNumber: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                />
                            </div>
                        </section>

                        <section
                            aria-labelledby="payment-summary-heading"
                            className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
                        >
                            <h2
                                id="payment-summary-heading"
                                className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
                            >
                                Payment Details
                            </h2>
                            <div className="px-2 py-4 font-medium text-gray-700">
                                <div className="flex gap-4 mb-6">
                                    {user ? (
                                        <>
                                            {/* Trigger Payment Modal */}
                                            <BuyNowModal
                                                addressInfo={addressInfo}
                                                setAddressInfo={setAddressInfo}
                                                openPaymentModal={openPaymentModal}
                                            />

                                            {/* Payment Modal */}
                                            <PaymentModal
                                                isOpen={paymentModalOpen}
                                                setIsOpen={setPaymentModalOpen}
                                                onPaymentSuccess={handlePaymentSuccess}
                                                onPaymentFailure={handlePaymentFailure}
                                            />
                                        </>
                                    ) : (
                                        <Navigate to={'/login'} />
                                    )}
                                </div>
                            </div>
                        </section>
                    </form>

                    {/* Display Payment Success/Failure */}
                    {paymentSuccess && <div className="text-green-500 font-semibold">Payment Successful! Order Confirmed.</div>}
                    {!paymentSuccess && paymentModalOpen === false && <div className="text-red-500 font-semibold">Payment Failed. Please try again.</div>}
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPage;
