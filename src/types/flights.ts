export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airportCode: string;
    city: string;
    time: string;
  };
  arrival: {
    airportCode: string;
    city: string;
    time: string;
  };
  price: number;
  currency: string;
  duration: string;
  // Add more properties as needed based on your API response
}