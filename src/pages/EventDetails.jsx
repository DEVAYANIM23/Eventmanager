import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, User } from 'lucide-react';
import { format } from 'date-fns';
import { db } from '../firebaseConfig'; // Import db from your firebaseConfig
import { doc, getDoc } from 'firebase/firestore';

function EventDetails() {
  const { id } = useParams();  // Get event ID from URL params
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Fetch event data from Firestore using the event ID
        const docRef = doc(db, 'events', id); // 'events' is the Firestore collection
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent(docSnap.data()); // Set the fetched event data
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEvent();
  }, [id]); // Fetch event data when the component mounts or the event ID changes

  if (!event) {
    return <div>Loading...</div>;  // Loading state while fetching event data
  }

  const handleBooking = () => {
    // Implement booking logic
    console.log('Booking', ticketCount, 'tickets for event', id);
  };

  return (
    <div className="pt-16">
      <div className="relative h-96">
        <img
          src={event.image || 'https://via.placeholder.com/1600x900'}
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
                <span>{format(new Date(event.date.seconds * 1000), 'MMMM dd, yyyy')}</span>
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

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Organizer</h2>
              <div className="flex items-center">
                <img
                  src={event.organizer?.image || 'https://via.placeholder.com/256'}
                  alt={event.organizer?.name || 'Organizer'}
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">{event.organizer?.name || 'Unknown Organizer'}</p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">${event.price}</span>
                <span className="text-gray-500"> per ticket</span>
              </div>

              <div className="mb-6">
                <div className="flex items-center text-gray-600 mb-2">
                  <Ticket className="h-5 w-5 mr-2" />
                  <span>{event.availableTickets} tickets available</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span>500+ people interested</span>
                </div>
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
                      {num} {num === 1 ? 'ticket' : 'tickets'}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
