import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig"; // Firebase import
import { doc, getDoc } from "firebase/firestore";
import { format } from "date-fns";

function PaymentPage() {
  const { id } = useParams();  // Get event ID from URL params
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEvent();
  }, [id]);

  // Handle payment initiation
  const handlePayment = () => {
    if (!window.Razorpay) {
      console.error("Razorpay SDK not loaded.");
      return;
    }

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Your Razorpay key ID
      amount: event.price * 100, // Convert to paise (1 INR = 100 paise)
      currency: "INR",
      name: event.title,
      description: `Booking tickets for ${event.title}`,
      image: event.image || "https://via.placeholder.com/150",
      handler: function (response) {
        alert("Payment successful: " + response.razorpay_payment_id);
        // You can handle post-payment logic here, like saving to Firestore, etc.
      },
      prefill: {
        name: "John Doe", // Pre-fill user details if needed
        email: "johndoe@example.com",
        contact: "9876543210",
      },
      notes: {
        event_id: event.id,
      },
      theme: {
        color: "#528FF0",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <span>{format(new Date(event.date.seconds * 1000), "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span>{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span>{event.location}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p>{event.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{event.price}</span>
              <span className="text-gray-500"> per ticket</span>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
