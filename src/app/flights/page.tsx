import React, { useState } from 'react';
import FlightSearchResults from '@/components/flights/flight-search-results'; // Import the results component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert component

const FlightSearchPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]); // State to store search results

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);
    setSearchResults([]); // Clear previous results

    // Collect form data
    const formData = new FormData(event.currentTarget);
    const origin = formData.get('origin');
    const destination = formData.get('destination');
    const departureDate = formData.get('departure-date');
    const returnDate = formData.get('return-date');
    const passengers = formData.get('passengers');
    const cabinClass = formData.get('cabin-class');

    console.log('Searching for flights with:', {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
    });

    // Placeholder for API call
    try {
      // Replace with your actual API endpoint and method
      const response = await fetch('/api/search-flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          departureDate,
          returnDate,
          passengers,
          cabinClass,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      // Process and display results here
      setSearchResults(data); // Store the results in state

    } catch (error: any) {
      console.error('Error searching for flights:', error);
      setError(error.message || 'An error occurred during the search.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Flight Search</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin:</label>
          <input type="text" id="origin" name="origin" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination:</label>
          <input type="text" id="destination" name="destination" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="departure-date" className="block text-sm font-medium text-gray-700">Departure Date:</label>
          <input type="date" id="departure-date" name="departure-date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="return-date" className="block text-sm font-medium text-gray-700">Return Date (Optional):</label>
          <input type="date" id="return-date" name="return-date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">Number of Passengers:</label>
          <input type="number" id="passengers" name="passengers" min="1" defaultValue={1} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="cabin-class" className="block text-sm font-medium text-gray-700">Cabin Class:</label>
          <select id="cabin-class" name="cabin-class" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="economy">Economy</option>
            <option value="premium-economy">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
        <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {isLoading && <p>Loading...</p>}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Render search results here */}
      {!isLoading && !error && searchResults.length > 0 && (
        <FlightSearchResults results={searchResults} />
      )}
    </div>
  );
};

export default FlightSearchPage;