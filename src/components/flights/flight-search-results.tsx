import React from 'react';
import { Flight } from '@/types/flights'; // Import the Flight type

interface FlightSearchResultsProps {
  results: Flight[]; // Use the Flight type
}

const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({ results }) => {
  return (
    <div>
      <h2>Search Results</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((flight) => (
            <li key={flight.id} className="border p-4 mb-4 rounded-md">
              <div>
                <strong>Airline:</strong> {flight.airline} ({flight.flightNumber})
              </div>
              <div>
                <strong>Departure:</strong> {flight.departure.city} ({flight.departure.airportCode}) at {flight.departure.time}
              </div>
              <div>
                <strong>Arrival:</strong> {flight.arrival.city} ({flight.arrival.airportCode}) at {flight.arrival.time}
              </div>
              <div>
                <strong>Duration:</strong> {flight.duration}
              </div>
              <div>
                <strong>Price:</strong> {flight.price} {flight.currency}
              </div>
              {/* Add more flight details here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights found.</p>
      )}
    </div>
  );
};

export default FlightSearchResults;