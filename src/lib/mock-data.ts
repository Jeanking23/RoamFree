// src/lib/mock-data.ts

export interface StayPhoto {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
}

export interface Host {
  name: string;
  avatar: string;
  dataAiHint: string;
}

export interface GuestReview {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string; 
  dataAiHintAvatar?: string;
}

export interface Policies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
}

export interface NeighborhoodInsights {
  walkabilityScore: number;
  crimeRate: string;
  schools: { name: string; rating: string; type: string }[];
  publicTransport: { type: string; line: string; stopDistance: string }[];
  description: string;
}

export interface MockStay {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  image: string; // Main image for card
  dataAiHint: string; // For main image
  rating: number;
  category: string; // e.g., "Villa", "Cabin", "Apartment", "Hotel" - for display
  type: "Hotel" | "Rental"; // For filtering: "HOTEL" or "RENTAL"
  maxGuests?: number;
  moods?: ("Peaceful" | "Romantic" | "Adventurous")[];
  isWheelchairAccessible?: boolean;
  isEcoFriendly?: boolean;
  reviewsCount?: number;
  description?: string;
  amenities?: string[];
  photos?: StayPhoto[]; // Detailed photos for [id] page
  host?: Host;
  guestReviews?: GuestReview[];
  availability?: string;
  policies?: Policies;
  virtualTourLink?: string;
  floorPlanLink?: string;
  neighborhoodInsights?: NeighborhoodInsights;
  // Fields for rentals and properties for sale can be added here or in specific types
  bedrooms?: number;
  bathrooms?: number;
  sizeSqft?: string | number; // Can be "2200 sqft" or just 2200
  sizeAcres?: string | number;
  propertyType?: string; // More specific: "House", "Apartment", "Land"
  zoning?: string; // For land/property sale
  status?: string; // e.g., "Verified", "Title Deed Uploaded"
  lastSalePrice?: number;
  marketTrend?: string;
  utilitiesIncluded?: string;
  walkabilityScore?: number;
  nearbySchools?: string; // simplified version for some mocks
  price?: number; // For total price in sales
}

export interface CarListing {
  id: number;
  name: string;
  type: string;
  year: number;
  seats: number;
  transmission: string;
  pricePerDay: number;
  pricePerHour: number;
  pricePerWeek: number;
  image: string;
  photos: { id: string, src: string, alt: string, dataAiHint: string }[];
  dataAiHint: string;
  features: string[];
  rating: number;
  reviews: number;
  insuranceIncluded: boolean;
  ecoFriendly: boolean;
  mileage: string;
  fuelPolicy: string;
  pickupLocations: string[];
  licenseRequired: string;
  description?: string;
}

export interface MockAttraction {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewsCount: number;
  description: string;
  openingHours: string;
  ticketPrice: string;
  amenities: string[];
  photos: StayPhoto[];
  userReviews: GuestReview[];
  website: string; 
  expectedCrowdLevel: string;
  contactInfo: string;
  liveStatus: string;
  maintenanceNote: string;
  deals: { id: string; title: string; description: string }[];
  visitorPhotos: StayPhoto[];
  topTips: string[];
}


export const allMockStays: MockStay[] = [
  {
    id: "stay1",
    name: "Sunny Beachfront Villa",
    location: "Bali, Indonesia",
    pricePerNight: 250,
    image: "https://images.unsplash.com/photo-1668277155756-0ebb2801f6b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxiZWFjaCUyMHZpbGxhJTIwYmFsaXxlbnwwfHx8fDE3NTI3MjUzOTZ8MA&ixlib-rb-4.1.0&q=80&w=1080",
    dataAiHint: "beach villa bali",
    rating: 4.8,
    category: "Villa",
    type: "Rental",
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 5,
    moods: ["Romantic", "Peaceful"],
    isEcoFriendly: true,
    isWheelchairAccessible: false,
    reviewsCount: 182,
    description: "Experience ultimate luxury in this stunning beachfront villa in Bali. Offering breathtaking ocean views, a private infinity pool, and direct beach access. Perfect for families or romantic getaways. Features 4 bedrooms, 5 bathrooms, a gourmet kitchen, and expansive outdoor living spaces.",
    amenities: ["Private Pool", "Beachfront", "WiFi", "Air Conditioning", "Full Kitchen", "Free Parking", "Daily Housekeeping"],
    photos: [
      { id: "p1s1", src: "https://images.unsplash.com/photo-1668277155756-0ebb2801f6b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxiZWFjaCUyMHZpbGxhJTIwYmFsaXxlbnwwfHx8fDE3NTI3MjUzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Bali villa ocean view", dataAiHint: "luxury villa ocean" },
      { id: "p2s1", src: "https://placehold.co/800x600.png", alt: "Infinity pool Bali", dataAiHint: "infinity pool" },
      { id: "p3s1", src: "https://placehold.co/800x600.png", alt: "Master bedroom Bali", dataAiHint: "luxury bedroom" },
      { id: "p4s1", src: "https://placehold.co/800x600.png", alt: "Living area Bali", dataAiHint: "modern living" },
    ],
    host: { name: "Wayan S.", avatar: "https://placehold.co/100x100.png", dataAiHint: "man portrait" },
    guestReviews: [
      { id: "gr1s1", user: "John K.", rating: 5, comment: "Paradise found! Amazing villa and host.", date: "2024-05-10", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar" },
      { id: "gr2s1", user: "Sarah L.", rating: 4, comment: "Beautiful, but a bit far from town.", date: "2024-04-22", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar"},
    ],
    policies: { checkIn: "After 3:00 PM", checkOut: "Before 11:00 AM", cancellation: "Flexible - Free cancellation up to 7 days before check-in." },
    neighborhoodInsights: { walkabilityScore: 70, crimeRate: "Very Low", schools: [{name: 'Green School Bali', rating: '4.8/5', type: 'International'}], publicTransport: [{type:'Scooter', line: 'Rental', stopDistance: 'Recommended'}], description: 'A quiet, upscale area known for its beautiful beaches and yoga retreats. Limited public transport, so scooter or car rental is advised.' }
  },
  {
    id: "stay2",
    name: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    pricePerNight: 180,
    image: "https://images.unsplash.com/photo-1610301349088-1d7ec5a1d961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxtb3VudGFpbiUyMGNhYmluJTIwc25vd3xlbnwwfHx8fDE3NTI3MjUzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "mountain cabin snow",
    rating: 4.9,
    category: "Cabin",
    type: "Rental",
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    moods: ["Peaceful", "Adventurous"],
    isEcoFriendly: false,
    isWheelchairAccessible: false,
    reviewsCount: 120,
    description: "A charming and cozy cabin nestled in the Aspen mountains. Features a fireplace, hot tub, and stunning forest views. Ideal for ski trips or summer hiking.",
    amenities: ["Hot Tub", "Fireplace", "WiFi", "Kitchenette", "Ski-in/Ski-out Access (nearby)"],
     photos: [
      { id: "p1s2", src: "https://images.unsplash.com/photo-1669394478167-a4965c32a98e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjYWJpbiUyMHNub3d8ZW58MHx8fHwxNzUyNzI4NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Cabin exterior in snow", dataAiHint: "cabin snow" },
      { id: "p2s2", src: "https://images.unsplash.com/photo-1697807713050-b0e7d00956a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjYWJpbiUyMGZpcmVwbGFjZXxlbnwwfHx8fDE3NTI3Mjg0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Cozy cabin interior with fireplace", dataAiHint: "cabin fireplace" },
    ],
    host: { name: "Mike R.", avatar: "https://placehold.co/100x100.png", dataAiHint: "man portrait" },
    guestReviews: [
      { id: "gr1s2", user: "Linda P.", rating: 5, comment: "Perfect cabin getaway! So cozy and beautiful.", date: "2024-02-10", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar"},
    ],
    policies: { checkIn: "After 4:00 PM", checkOut: "Before 10:00 AM", cancellation: "Strict - 50% refund up to 1 week prior to arrival." },
    neighborhoodInsights: { walkabilityScore: 30, crimeRate: "Very Low", schools: [{name: 'Aspen Elementary', rating: 'N/A', type: 'Public'}], publicTransport: [{type:'Bus', line: 'Route 3', stopDistance: '1 mile'}], description: 'Secluded and quiet, perfect for nature lovers. A car is essential for getting around and accessing town amenities.' }
  },
  {
    id: "stay3",
    name: "Urban Chic Hotel Room",
    location: "Paris, France",
    pricePerNight: 150,
    image: "https://images.unsplash.com/photo-1694637768991-0397391eb557?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBwYXJpc3xlbnwwfHx8fDE3NTI3MjUzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "modern hotel room paris",
    rating: 4.7,
    category: "Hotel Room",
    type: "Hotel",
    maxGuests: 2,
    moods: ["Romantic"],
    isEcoFriendly: true,
    isWheelchairAccessible: true,
    reviewsCount: 250,
    description: "Stylish hotel room in the heart of Paris, close to major attractions. Features a comfortable king bed, city views, and daily breakfast.",
    amenities: ["Daily Breakfast", "Concierge", "WiFi", "Air Conditioning", "Ensuite Bathroom"],
    photos: [
      { id: "p1s3", src: "https://images.unsplash.com/photo-1694637768991-0397391eb557?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBwYXJpc3xlbnwwfHx8fDE3NTI3MjUzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Paris hotel room view", dataAiHint: "hotel room paris" },
      { id: "p2s3", src: "https://placehold.co/800x600.png", alt: "Hotel lobby Paris", dataAiHint: "hotel lobby chic" },
    ],
    host: { name: "Hotel Le Grand", avatar: "https://placehold.co/100x100.png", dataAiHint: "hotel logo" },
    guestReviews: [
      { id: "gr1s3", user: "David B.", rating: 5, comment: "Fantastic location and lovely hotel. Staff were excellent.", date: "2024-05-01", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar"},
    ],
     policies: { checkIn: "After 2:00 PM", checkOut: "Before 12:00 PM", cancellation: "Free cancellation up to 24 hours before check-in." },
    neighborhoodInsights: { walkabilityScore: 98, crimeRate: "Low", schools: [{name:'Sorbonne University', rating:'World-class', type:'University'}], publicTransport: [{type:'Metro', line:'Line 4', stopDistance:'100m'}], description: 'Vibrant, historic neighborhood bustling with cafes, shops, and museums. Everything is accessible on foot.' }
  },
  {
    id: "stay4",
    name: "Riverside Lodge Escape",
    location: "Scottish Highlands",
    pricePerNight: 220,
    image: "https://images.unsplash.com/photo-1668597354945-b67f6a77ded5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxyaXZlciUyMGxvZGdlJTIwc2NvdGxhbmR8ZW58MHx8fHwxNzUyNzI1Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "river lodge scotland",
    rating: 4.6,
    category: "Lodge",
    type: "Rental",
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    moods: ["Peaceful", "Adventurous"],
    isEcoFriendly: true,
    reviewsCount: 95,
    description: "A beautiful lodge by the river in the Scottish Highlands. Perfect for fishing, hiking, and relaxing in nature. Offers 3 bedrooms and a cozy fireplace.",
    amenities: ["River Access", "Fishing Gear (rental)", "WiFi", "Full Kitchen", "Log Burner"],
    photos: [ { id: "p1s4", src: "https://images.unsplash.com/photo-1668597354945-b67f6a77ded5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxyaXZlciUyMGxvZGdlJTIwc2NvdGxhbmR8ZW58MHx8fHwxNzUyNzI1Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Lodge exterior", dataAiHint: "lodge highlands river" } ],
    host: { name: "Angus McTavish", avatar: "https://placehold.co/100x100.png", dataAiHint: "man portrait" },
    guestReviews: [ { id: "gr1s4", user: "Emily R.", rating: 5, comment: "Stunning location, very peaceful.", date: "2024-03-20", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar"} ],
    policies: { checkIn: "After 4:00 PM", checkOut: "Before 10:00 AM", cancellation: "Moderate - Full refund 14 days prior." },
    neighborhoodInsights: { walkabilityScore: 20, crimeRate: "Very Low", schools: [{name: 'Village School', rating: 'N/A', type:'Primary'}], publicTransport: [{type:'Bus', line: 'Regional', stopDistance:'5 miles'}], description: 'Remote and wild, offering unparalleled access to nature. A vehicle is essential.' }
  },
  {
    id: "stay5",
    name: "Desert Oasis Hotel",
    location: "Sedona, Arizona",
    pricePerNight: 300,
    image: "https://images.unsplash.com/photo-1605474231454-4c006ed61ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxkZXNlcnQlMjBob3RlbCUyMGFyaXpvbmF8ZW58MHx8fHwxNzUyNzI1Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "desert hotel arizona",
    rating: 4.8,
    category: "Hotel",
    type: "Hotel",
    maxGuests: 3, // per room
    isWheelchairAccessible: true,
    reviewsCount: 210,
    description: "Luxury hotel offering stunning red rock views, spa services, and gourmet dining. Perfect for a rejuvenating escape.",
    amenities: ["Spa", "Pool", "Restaurant", "WiFi", "Air Conditioning", "Fitness Center"],
    photos: [ { id: "p1s5", src: "https://images.unsplash.com/photo-1605474231454-4c006ed61ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxkZXNlcnQlMjBob3RlbCUyMGFyaXpvbmF8ZW58MHx8fHwxNzUyNzI1Mzk2fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Sedona hotel with view", dataAiHint: "hotel desert view" } ],
    host: { name: "Enchantment Resort", avatar: "https://placehold.co/100x100.png", dataAiHint: "resort logo" },
    guestReviews: [ { id: "gr1s5", user: "Michael C.", rating: 5, comment: "Unforgettable views and top-notch service.", date: "2024-04-15", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar"} ],
    policies: { checkIn: "After 3:00 PM", checkOut: "Before 11:00 AM", cancellation: "Free cancellation up to 48 hours before check-in." },
    neighborhoodInsights: { walkabilityScore: 60, crimeRate: "Low", schools: [{name: 'Sedona Red Rock High', rating: 'Good', type: 'Public'}], publicTransport: [{type: 'Shuttle', line: 'Local', stopDistance: 'On-site'}], description: 'Located near popular trailheads and art galleries. A local shuttle service provides easy access to town.' }
  },
  {
    id: "stay6",
    name: "Historic City Center Flat",
    location: "Rome, Italy",
    pricePerNight: 120,
    image: "https://images.unsplash.com/photo-1724020538147-da2fe0a93751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxoaXN0b3JpYyUyMGJ1aWxkaW5nJTIwcm9tZXxlbnwwfHx8fDE3NTI3MjUzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    dataAiHint: "historic building rome",
    rating: 4.5,
    category: "Flat",
    type: "Rental",
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    moods: ["Romantic"],
    isEcoFriendly: false,
    reviewsCount: 155,
    description: "Charming flat in a historic building, steps away from ancient Roman landmarks. Features one bedroom, a small kitchen, and traditional decor.",
    amenities: ["Central Location", "WiFi", "Kitchenette", "Air Conditioning"],
    photos: [ { id: "p1s6", src: "https://images.unsplash.com/photo-1724020538147-da2fe0a93751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxoaXN0b3JpYyUyMGJ1aWxkaW5nJTIwcm9tZXxlbnwwfHx8fDE3NTI3MjUzOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Rome flat interior", dataAiHint: "apartment rome interior" } ],
    host: { name: "Marco Rossi", avatar: "https://placehold.co/100x100.png", dataAiHint: "man portrait" },
    guestReviews: [ { id: "gr1s6", user: "Jessica B.", rating: 4, comment: "Amazing location for sightseeing!", date: "2024-03-05", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar"} ],
    policies: { checkIn: "After 2:00 PM", checkOut: "Before 10:00 AM", cancellation: "Non-refundable." },
    neighborhoodInsights: { walkabilityScore: 99, crimeRate: "Medium", schools: [], publicTransport: [{type:'Metro', line:'Line A', stopDistance:'200m'}, {type:'Bus', line: 'Multiple', stopDistance:'50m'}], description: 'Immerse yourself in history. Steps from the Colosseum and Roman Forum. Can be noisy due to central location.' }
  }
];

export const carListings: CarListing[] = [
  {
    id: 1,
    name: "Toyota Camry Hybrid",
    type: "Sedan",
    year: 2023,
    seats: 5,
    transmission: "Automatic",
    pricePerDay: 55,
    pricePerHour: 10,
    pricePerWeek: 350,
    image: "https://images.unsplash.com/photo-1607928086418-95fc643a0e0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c2VkYW4lMjBjYXJ8ZW58MHx8fHwxNzUyNzIyMTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    photos: [
      { id: "car1p1", src: "https://images.unsplash.com/photo-1607928086418-95fc643a0e0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c2VkYW4lMjBjYXJ8ZW58MHx8fHwxNzUyNzIyMTg5fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Camry front view", dataAiHint: "sedan front" },
      { id: "car1p2", src: "https://placehold.co/800x600.png", alt: "Camry interior", dataAiHint: "car dashboard" },
      { id: "car1p3", src: "https://placehold.co/800x600.png", alt: "Camry side view", dataAiHint: "sedan side" },
    ],
    dataAiHint: "sedan car",
    features: ["Hybrid Fuel Efficiency", "Advanced Safety Suite", "Spacious Interior", "Bluetooth Audio", "Apple CarPlay/Android Auto"],
    rating: 4.8,
    reviews: 120,
    insuranceIncluded: true,
    ecoFriendly: true,
    mileage: "15,000 miles",
    fuelPolicy: "Full-to-Full",
    pickupLocations: ["Airport", "Downtown", "Hotel Delivery (Demo)"],
    licenseRequired: "Standard Driver's License, Min Age 21",
    description: "A perfect blend of efficiency and comfort. This Toyota Camry Hybrid offers a smooth ride, excellent gas mileage, and a spacious, tech-forward interior. Ideal for city driving or long road trips."
  },
  {
    id: 2,
    name: "Ford Explorer XLT",
    type: "SUV",
    year: 2022,
    seats: 7,
    transmission: "Automatic",
    pricePerDay: 85,
    pricePerHour: 18,
    pricePerWeek: 550,
    image: "https://images.unsplash.com/photo-1618353482480-61ca5a9a7879?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzdXYlMjBjYXJ8ZW58MHx8fHwxNzUyNzIyMTg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    photos: [
      { id: "car2p1", src: "https://images.unsplash.com/photo-1618353482480-61ca5a9a7879?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzdXYlMjBjYXJ8ZW58MHx8fHwxNzUyNzIyMTg5fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Explorer front view", dataAiHint: "suv front" },
      { id: "car2p2", src: "https://placehold.co/800x600.png", alt: "Explorer interior with third row", dataAiHint: "suv interior seats" },
    ],
    dataAiHint: "suv car",
    features: ["Third-Row Seating", "All-Wheel Drive", "Panoramic Sunroof", "Apple CarPlay/Android Auto", "Towing Package"],
    rating: 4.5,
    reviews: 95,
    insuranceIncluded: true,
    ecoFriendly: false,
    mileage: "22,000 miles",
    fuelPolicy: "Full-to-Full",
    pickupLocations: ["Airport", "West End Branch", "One-Way to City B (Demo)"],
    licenseRequired: "Standard Driver's License, Min Age 25",
    description: "The Ford Explorer is the ultimate family adventure vehicle. With three rows of seating, all-wheel drive, and a panoramic sunroof, it's ready for any journey. Ample cargo space and modern tech make it a comfortable and capable choice."
  },
  {
    id: 3,
    name: "Mercedes-Benz Sprinter",
    type: "Van",
    year: 2023,
    seats: 12,
    transmission: "Automatic",
    pricePerDay: 150,
    pricePerHour: 30,
    pricePerWeek: 950,
    image: "https://images.unsplash.com/photo-1635714612847-a515e7939326?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx2YW4lMjB2ZWhpY2xlfGVufDB8fHx8MTc1MjcyMjE4OXww&ixlib=rb-4.1.0&q=80&w=1080",
     photos: [
      { id: "car3p1", src: "https://images.unsplash.com/photo-1635714612847-a515e7939326?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx2YW4lMjB2ZWhpY2xlfGVufDB8fHx8MTc1MjcyMjE4OXww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Sprinter van exterior", dataAiHint: "white van" },
      { id: "car3p2", src: "https://placehold.co/800x600.png", alt: "Sprinter van interior seating", dataAiHint: "van interior" },
    ],
    dataAiHint: "van vehicle",
    features: ["High Roof", "Ample Cargo Space", "Comfortable for Groups", "Rear AC", "Bluetooth Connectivity"],
    rating: 4.9,
    reviews: 70,
    insuranceIncluded: false,
    ecoFriendly: false,
    mileage: "8,000 miles",
    fuelPolicy: "Like-for-Like",
    pickupLocations: ["Business Park Depot", "Custom Location Delivery (Demo)"],
    licenseRequired: "Standard Driver's License, Min Age 25, Commercial Endorsement (Demo if applicable)",
    description: "Perfect for large groups, corporate outings, or moving lots of gear. The Mercedes-Benz Sprinter offers unmatched space and comfort for up to 12 passengers. High roof allows for easy movement inside the van."
  }
];

export const mockRentalProperties: MockStay[] = [
  { 
    id: "rent1", 
    name: "Chic Downtown Loft", 
    pricePerNight: 73, // Assuming 2200/month ~ 73/night for consistency, though listing might be per month
    price: 2200, // Monthly price
    location: "City Center", 
    category: "Apartment", 
    type: "Rental",
    bedrooms: 1, 
    bathrooms: 1,
    sizeSqft: "900 sqft",
    amenities: ["Gym", "Pool", "In-unit Laundry"], 
    image: "https://images.unsplash.com/photo-1704428381312-0579346a779c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsb2Z0JTIwYXBhcnRtZW50fGVufDB8fHx8MTc1Mjc1NDU5NHww&ixlib=rb-4.1.0&q=80&w=1080", 
    dataAiHint: "loft apartment", 
    virtualTourLink: "#", 
    floorPlanLink: "#", 
    isEcoFriendly: true,
    description: "A stylish and modern loft apartment in the heart of downtown. Features high ceilings, large windows, and access to building amenities like a gym and pool. Perfect for urban living.",
    rating: 4.7,
    reviewsCount: 55,
    photos: [
        { id: "p1r1", src: "https://images.unsplash.com/photo-1704428381312-0579346a779c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsb2Z0JTIwYXBhcnRtZW50fGVufDB8fHx8MTc1Mjc1NDU5NHww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Loft living area", dataAiHint: "loft interior" },
        { id: "p2r1", src: "https://placehold.co/800x600.png", alt: "Loft kitchen", dataAiHint: "modern kitchen" },
    ],
    host: { name: "Urban Living Inc.", avatar: "https://placehold.co/100x100.png", dataAiHint: "company logo" },
    neighborhoodInsights: { walkabilityScore: 95, crimeRate: "Low", schools: [{name: 'City High', rating: '4/5', type: 'Public'}, {name: 'Downtown Elementary', rating: '5/5', type: 'Public'}], publicTransport: [{type:'Subway', line: 'Blue Line', stopDistance: '2 blocks'}, {type:'Bus', line: 'C-3', stopDistance:'1 block'}], description: 'A vibrant urban neighborhood with easy access to restaurants, theaters, and parks. Highly walkable and excellent public transport links.' }
  },
  { 
    id: "rent2", 
    name: "Suburban Family House", 
    pricePerNight: 116, // Approx from 3500/month
    price: 3500,
    location: "Green Meadows", 
    category: "House", 
    type: "Rental",
    bedrooms: 3, 
    bathrooms: 2,
    sizeSqft: "1800 sqft",
    amenities: ["Yard", "Garage", "Pet-friendly"], 
    image: "https://images.unsplash.com/photo-1715249891396-653a32ff2d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmYW1pbHklMjBob3VzZSUyMHN1YnVyYmFufGVufDB8fHx8MTc1Mjc1NDU5NHww&ixlib=rb-4.1.0&q=80&w=1080", 
    dataAiHint: "family house suburban", 
    virtualTourLink: "#", 
    floorPlanLink: "#", 
    isEcoFriendly: false,
    description: "Spacious family home in a quiet suburban neighborhood. Large backyard, two-car garage, and pet-friendly policy. Close to parks and good schools.",
    rating: 4.5,
    reviewsCount: 30,
    photos: [ 
        { id: "p1r2", src: "https://images.unsplash.com/photo-1715249891396-653a32ff2d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxmYW1pbHklMjBob3VzZSUyMHN1YnVyYmFufGVufDB8fHx8MTc1Mjc1NDU5NHww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Family house exterior", dataAiHint: "suburban house" },
        { id: "p2r2", src: "https://placehold.co/800x600.png", alt: "Family house backyard", dataAiHint: "house backyard" }
    ],
    host: { name: "Sarah Miller", avatar: "https://placehold.co/100x100.png", dataAiHint: "woman portrait" },
    neighborhoodInsights: { walkabilityScore: 70, crimeRate: "Very Low", schools: [{name: 'Greenwood High', rating: '5/5', type: 'Public'}, {name: 'Meadowbrook Elementary', rating: '4/5', type: 'Public'}], publicTransport: [{type:'Bus', line: 'S-12', stopDistance:'0.5 miles'}], description: 'A peaceful, family-friendly area known for its excellent schools and community parks. Car recommended for commuting.' }
  },
  { 
    id: "rent3", 
    name: "Modern Townhouse", 
    pricePerNight: 93, // Approx from 2800/month
    price: 2800,
    location: "North District", 
    category: "Townhouse", 
    type: "Rental",
    bedrooms: 2, 
    bathrooms: 2.5,
    sizeSqft: "1500 sqft",
    amenities: ["Rooftop Deck", "Smart Home"], 
    image: "https://images.unsplash.com/photo-1667828369152-ddb46c1beebf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjB0b3duaG91c2V8ZW58MHx8fHwxNzUyNzU0NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080", 
    dataAiHint: "modern townhouse", 
    virtualTourLink: "#", 
    floorPlanLink: "#", 
    isEcoFriendly: true,
    description: "Contemporary townhouse with a private rooftop deck and smart home features. Two bedrooms, open-plan living, and close to city amenities.",
    rating: 4.6,
    reviewsCount: 42,
    photos: [ 
        { id: "p1r3", src: "https://images.unsplash.com/photo-1667828369152-ddb46c1beebf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjB0b3duaG91c2V8ZW58MHx8fHwxNzUyNzU0NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Townhouse rooftop deck", dataAiHint: "rooftop deck city" },
        { id: "p2r3", src: "https://placehold.co/800x600.png", alt: "Townhouse interior", dataAiHint: "modern interior" }
    ],
    host: { name: "Tech Homes LLC", avatar: "https://placehold.co/100x100.png", dataAiHint: "company logo" },
    neighborhoodInsights: { walkabilityScore: 85, crimeRate: "Low", schools: [{name: 'Northwood Academy', rating: '4.5/5', type: 'Charter'}], publicTransport: [{type:'Light Rail', line: 'Green', stopDistance:'5 min walk'}], description: 'An up-and-coming district with a mix of residential and commercial spaces. Great for young professionals.' }
  },
];

export const mockSaleProperties: MockStay[] = [
    { 
        id: "sale1", 
        name: "162 Brookwood Dr", 
        location: "Camden Wyoming, DE 19934",
        price: 525000, 
        pricePerNight: 0,
        propertyType: "House", 
        type: "Rental", // Note: This field may need to be 'Sale'
        category: "House",
        bedrooms: 4,
        bathrooms: 3,
        sizeSqft: "3,814",
        sizeAcres: "0.58",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGhvdXNlfGVufDB8fHx8MTc1MjgxMjQwMnww&ixlib=rb-4.1.0&q=80&w=1080", 
        dataAiHint: "suburban house", 
        rating: 4.8,
        photos: [
            { id: "p1s1", src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMGhvdXNlfGVufDB8fHx8MTc1MjgxMjQwMnww&ixlib=rb-4.1.0&q=80&w=1080", alt: "suburban house front", dataAiHint: "suburban house" },
            { id: "p2s1", src: "https://placehold.co/800x600.png", alt: "suburban house kitchen", dataAiHint: "house kitchen" },
        ]
    },
    { 
        id: "sale2", 
        name: "26 Meadow Ave", 
        location: "Wyoming, DE 19934",
        price: 374900, 
        pricePerNight: 0,
        propertyType: "House", 
        type: "Rental",
        category: "House",
        bedrooms: 3,
        bathrooms: 2,
        sizeSqft: "1,660",
        sizeAcres: "0.34",
        image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHN1YnVyYmFuJTIwaG91c2V8ZW58MHx8fHwxNzUyODEyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080", 
        dataAiHint: "small suburban house", 
        rating: 4.5,
        photos: [
            { id: "p1s2", src: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHN1YnVyYmFuJTIwaG91c2V8ZW58MHx8fHwxNzUyODEyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "small house front", dataAiHint: "small suburban house" },
            { id: "p2s2", src: "https://placehold.co/800x600.png", alt: "small house living room", dataAiHint: "cozy living" },
        ]
    },
    { 
        id: "sale3", 
        name: "17 S Main St", 
        location: "Camden, DE 19934",
        price: 249900, 
        pricePerNight: 0,
        propertyType: "House", 
        type: "Rental",
        category: "House",
        bedrooms: 3,
        bathrooms: 1.5,
        sizeSqft: "1,814",
        sizeAcres: "0.25",
        image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0d28lMjBzdG9yeSUyMGhvdXNlfGVufDB8fHx8MTc1MjgxMjQwMnww&ixlib=rb-4.1.0&q=80&w=1080", 
        dataAiHint: "two story house", 
        rating: 4.3,
        photos: [
            { id: "p1s3", src: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0d28lMjBzdG9yeSUyMGhvdXNlfGVufDB8fHx8MTc1MjgxMjQwMnww&ixlib=rb-4.1.0&q=80&w=1080", alt: "two story house front", dataAiHint: "two story house" },
        ]
    },
];


// Moved from attractions/[id]/page.tsx
export const mockAttractionDetails: MockAttraction = {
  id: "attr1",
  name: "City Museum of Art",
  category: "Culture",
  location: "123 Art Avenue, Downtown Cityville",
  rating: 4.7,
  reviewsCount: 320,
  description: "Explore a vast collection of modern and classical art spanning centuries. The City Museum of Art offers engaging exhibits, workshops, and guided tours. A must-visit for art enthusiasts and curious minds alike.",
  openingHours: "Tue-Sun: 10:00 AM - 6:00 PM (Closed Mondays)",
  ticketPrice: "$25 (Adults), $15 (Students/Seniors), Free (Children under 12)",
  amenities: ["Cafe", "Gift Shop", "Wheelchair Accessible", "Guided Tours", "Restrooms", "Family Areas"],
  photos: [
    { id: "p1", src: "https://placehold.co/800x600.png", alt: "Museum main exhibit hall", dataAiHint: "museum exhibit" },
    { id: "p2", src: "https://placehold.co/400x300.png", alt: "Museum sculpture garden", dataAiHint: "sculpture garden" },
    { id: "p3", src: "https://placehold.co/400x300.png", alt: "Museum exterior facade", dataAiHint: "museum building" },
    { id: "p4", src: "https://placehold.co/400x300.png", alt: "Interactive display for kids", dataAiHint: "interactive museum" },
  ],
  userReviews: [
    { id: "r1", user: "Chris P.", rating: 5, comment: "Incredible collection and beautifully curated. Spent the whole afternoon here!", date: "2024-04-10", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar" },
    { id: "r2", user: "Jordan B.", rating: 4, comment: "Great museum, very informative. Some sections were a bit crowded.", date: "2024-03-22", avatar: "https://placehold.co/40x40.png", dataAiHintAvatar: "person avatar" },
  ],
  website: "https://examplemuseum.com", 
  expectedCrowdLevel: "Moderate",
  contactInfo: "info@examplemuseum.com / +1-555-ART-MUSEUM",
  liveStatus: "Open",
  maintenanceNote: "The East Wing will be closed for renovations from July 1st.",
  deals: [
    { id: "deal1", title: "Family Pass", description: "Save 15% on 2 Adults and 2 Children tickets." },
    { id: "deal2", title: "Museum + Lunch Combo", description: "Get a ticket and a pre-fixe lunch at our cafe for only $40." },
    { id: "deal3", title: "Student Tuesday", description: "50% off adult admission every Tuesday with a valid student ID." },
  ],
  visitorPhotos: [
    { id: "vp1", src: "https://images.unsplash.com/photo-1645165102257-9963785edd8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtdXNldW0lMjBzZWxmaWV8ZW58MHx8fHwxNzUzMjAxMDM4fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Visitor taking a selfie with a painting", dataAiHint: "museum selfie" },
    { id: "vp2", src: "https://images.unsplash.com/photo-1732996909415-8653208de4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwZXJzb24lMjBhcnR8ZW58MHx8fHwxNzUzMjAxMDM4fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Visitor admiring a sculpture", dataAiHint: "person art" },
    { id: "vp3", src: "https://images.unsplash.com/photo-1561246806-04a48afaf9ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjaGlsZCUyMG11c2V1bXxlbnwwfHx8fDE3NTMyMDEwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "A child interacting with an exhibit", dataAiHint: "child museum" },
  ],
  topTips: [
      "Go early on a weekday to avoid the biggest crowds.",
      "The audio guide is highly recommended for a richer experience.",
      "Don't miss the special exhibit on the second floor – it changes seasonally!",
      "The cafe has surprisingly good coffee and pastries.",
  ]
};


// You might want to combine or ensure IDs are unique if using allMockStays as a single source
// For now, I'll keep them separate but the detail pages will need to know which list to pull from.
// Or better, create a unified list or a getter function.
// For simplicity of this step, I will assume detail pages will fetch from these specific arrays.

export function findRentalPropertyById(id: string): MockStay | undefined {
  return mockRentalProperties.find(property => property.id === id);
}

export function findSalePropertyById(id: string): MockStay | undefined {
  return mockSaleProperties.find(property => property.id === id);
}
