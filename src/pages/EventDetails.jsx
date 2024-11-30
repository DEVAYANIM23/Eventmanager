import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, Ticket, User } from "lucide-react";
import { format } from "date-fns";
import { db } from "../firebaseConfig"; // Import db from your firebaseConfig
import { doc, getDoc } from "firebase/firestore";
import BuyNowModal from "../buyNowModal/BuyNowModal"; // Corrected import path

function EventDetails() {
  const { id } = useParams(); // Get event ID from URL params
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [addressInfo, setAddressInfo] = useState({
    name: "",
    address: "",
    pincode: "",
    mobileNumber: "",
  });
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

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

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleBuyNow = () => {
    console.log("Buy Now clicked");
    console.log("Address Info:", addressInfo);
    console.log("Ticket Count:", ticketCount);
    // Implement purchase logic here (e.g., API call)
    setPaymentModalOpen(true); // Open payment modal
  };

  const clearCart = () => {
    setTicketCount(1);
    setAddressInfo({ name: "", address: "", pincode: "", mobileNumber: "" });
  };

  return (
    <div className="pt-16">
      <div className="relative h-96">
        <img
          src={event.image || "https://via.placeholder.com/1600x900"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{format(new Date(event.date.seconds * 1000), "MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About this event</h2>
              <p className="text-gray-600">{event.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">${event.price}</span>
                <span className="text-gray-500"> per ticket</span>
              </div>

              <div className="mb-6">
                <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <select
                  id="tickets"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "ticket" : "tickets"}
                    </option>
                  ))}
                </select>
              </div>

              <BuyNowModal
                addressInfo={addressInfo}
                setAddressInfo={setAddressInfo}
                buyNowFunction={handleBuyNow}
                openPaymentModal={() => setPaymentModalOpen(true)}
                clearCart={clearCart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
