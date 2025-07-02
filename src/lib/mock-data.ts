
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
  nearbySchools: string;
  publicTransport: string;
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
  nearbySchools?: string;
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


export const allMockStays: MockStay[] = [
  {
    id: "stay1",
    name: "Sunny Beachfront Villa",
    location: "Bali, Indonesia",
    pricePerNight: 250,
    image: "https://placehold.co/600x400.png?text=Beach+Villa+Bali",
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
      { id: "p1s1", src: "https://placehold.co/800x600.png?text=Bali+Villa+View", alt: "Bali villa ocean view", dataAiHint: "luxury villa ocean" },
      { id: "p2s1", src: "https://placehold.co/400x300.png?text=Bali+Pool", alt: "Infinity pool Bali", dataAiHint: "infinity pool" },
      { id: "p3s1", src: "https://placehold.co/400x300.png?text=Bali+Bedroom", alt: "Master bedroom Bali", dataAiHint: "luxury bedroom" },
      { id: "p4s1", src: "https://placehold.co/400x300.png?text=Bali+Living", alt: "Living area Bali", dataAiHint: "modern living" },
    ],
    host: { name: "Wayan S.", avatar: "https://placehold.co/100x100.png?text=WS", dataAiHint: "man portrait" },
    guestReviews: [
      { id: "gr1s1", user: "John K.", rating: 5, comment: "Paradise found! Amazing villa and host.", date: "2024-05-10", avatar: "https://placehold.co/40x40.png?text=JK", dataAiHintAvatar: "person avatar" },
      { id: "gr2s1", user: "Sarah L.", rating: 4, comment: "Beautiful, but a bit far from town.", date: "2024-04-22", avatar: "https://placehold.co/40x40.png?text=SL", dataAiHintAvatar: "person avatar"},
    ],
    policies: { checkIn: "After 3:00 PM", checkOut: "Before 11:00 AM", cancellation: "Flexible - Free cancellation up to 7 days before check-in." },
    neighborhoodInsights: { walkabilityScore: 70, crimeRate: "Very Low", nearbySchools: "Green School Bali (15 min drive)", publicTransport: "Scooter rental recommended" }
  },
  {
    id: "stay2",
    name: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    pricePerNight: 180,
    image: "https://placehold.co/600x400.png?text=Aspen+Cabin",
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
      { id: "p1s2", src: "https://placehold.co/800x600.png?text=Cabin+Exterior", alt: "Cabin exterior in snow", dataAiHint: "cabin snow" },
      { id: "p2s2", src: "https://placehold.co/400x300.png?text=Cabin+Interior", alt: "Cozy cabin interior with fireplace", dataAiHint: "cabin fireplace" },
    ],
    host: { name: "Mike R.", avatar: "https://placehold.co/100x100.png?text=MR", dataAiHint: "man portrait" },
    guestReviews: [
      { id: "gr1s2", user: "Linda P.", rating: 5, comment: "Perfect cabin getaway! So cozy and beautiful.", date: "2024-02-10", avatar: "https://placehold.co/40x40.png?text=LP", dataAiHintAvatar: "person avatar"},
    ],
    policies: { checkIn: "After 4:00 PM", checkOut: "Before 10:00 AM", cancellation: "Strict - 50% refund up to 1 week prior to arrival." },
    neighborhoodInsights: { walkabilityScore: 30, crimeRate: "Very Low", nearbySchools: "Aspen Elementary (10 min drive)", publicTransport: "Car essential" }
  },
  {
    id: "stay3",
    name: "Urban Chic Hotel Room",
    location: "Paris, France",
    pricePerNight: 150,
    image: "https://placehold.co/600x400.png?text=Paris+Hotel",
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
      { id: "p1s3", src: "https://placehold.co/800x600.png?text=Paris+Hotel+Room", alt: "Paris hotel room view", dataAiHint: "hotel room paris" },
      { id: "p2s3", src: "https://placehold.co/400x300.png?text=Hotel+Lobby", alt: "Hotel lobby Paris", dataAiHint: "hotel lobby chic" },
    ],
    host: { name: "Hotel Le Grand", avatar: "https://placehold.co/100x100.png?text=LG", dataAiHint: "hotel logo" },
    guestReviews: [
      { id: "gr1s3", user: "David B.", rating: 5, comment: "Fantastic location and lovely hotel. Staff were excellent.", date: "2024-05-01", avatar: "https://placehold.co/40x40.png?text=DB", dataAiHintAvatar: "person avatar"},
    ],
     policies: { checkIn: "After 2:00 PM", checkOut: "Before 12:00 PM", cancellation: "Free cancellation up to 24 hours before check-in." },
    neighborhoodInsights: { walkabilityScore: 98, crimeRate: "Low", nearbySchools: "Sorbonne University (walking distance)", publicTransport: "Metro station 100m" }
  },
  {
    id: "stay4",
    name: "Riverside Lodge Escape",
    location: "Scottish Highlands",
    pricePerNight: 220,
    image: "https://placehold.co/600x400.png?text=Highlands+Lodge",
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
    photos: [ { id: "p1s4", src: "https://placehold.co/800x600.png?text=Lodge+Exterior+Highlands", alt: "Lodge exterior", dataAiHint: "lodge highlands river" } ],
    host: { name: "Angus McTavish", avatar: "https://placehold.co/100x100.png?text=AM", dataAiHint: "man portrait" },
    guestReviews: [ { id: "gr1s4", user: "Emily R.", rating: 5, comment: "Stunning location, very peaceful.", date: "2024-03-20", avatar: "https://placehold.co/40x40.png?text=ER", dataAiHintAvatar: "person avatar"} ],
    policies: { checkIn: "After 4:00 PM", checkOut: "Before 10:00 AM", cancellation: "Moderate - Full refund 14 days prior." },
    neighborhoodInsights: { walkabilityScore: 20, crimeRate: "Very Low", nearbySchools: "Village School (5 miles)", publicTransport: "Car necessary" }
  },
  {
    id: "stay5",
    name: "Desert Oasis Hotel",
    location: "Sedona, Arizona",
    pricePerNight: 300,
    image: "https://placehold.co/600x400.png?text=Sedona+Hotel",
    dataAiHint: "desert hotel arizona",
    rating: 4.8,
    category: "Hotel",
    type: "Hotel",
    maxGuests: 3, // per room
    isWheelchairAccessible: true,
    reviewsCount: 210,
    description: "Luxury hotel offering stunning red rock views, spa services, and gourmet dining. Perfect for a rejuvenating escape.",
    amenities: ["Spa", "Pool", "Restaurant", "WiFi", "Air Conditioning", "Fitness Center"],
    photos: [ { id: "p1s5", src: "https://placehold.co/800x600.png?text=Sedona+Hotel+View", alt: "Sedona hotel with view", dataAiHint: "hotel desert view" } ],
    host: { name: "Enchantment Resort", avatar: "https://placehold.co/100x100.png?text=ER", dataAiHint: "resort logo" },
    guestReviews: [ { id: "gr1s5", user: "Michael C.", rating: 5, comment: "Unforgettable views and top-notch service.", date: "2024-04-15", avatar: "https://placehold.co/40x40.png?text=MC", dataAiHintAvatar: "person avatar"} ],
    policies: { checkIn: "After 3:00 PM", checkOut: "Before 11:00 AM", cancellation: "Free cancellation up to 48 hours before check-in." },
    neighborhoodInsights: { walkabilityScore: 60, crimeRate: "Low", nearbySchools: "Sedona Red Rock High (nearby)", publicTransport: "Local shuttle available" }
  },
  {
    id: "stay6",
    name: "Historic City Center Flat",
    location: "Rome, Italy",
    pricePerNight: 120,
    image: "https://placehold.co/600x400.png?text=Rome+Flat",
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
    photos: [ { id: "p1s6", src: "https://placehold.co/800x600.png?text=Rome+Flat+Interior", alt: "Rome flat interior", dataAiHint: "apartment rome interior" } ],
    host: { name: "Marco Rossi", avatar: "https://placehold.co/100x100.png?text=MR", dataAiHint: "man portrait" },
    guestReviews: [ { id: "gr1s6", user: "Jessica B.", rating: 4, comment: "Amazing location for sightseeing!", date: "2024-03-05", avatar: "https://placehold.co/40x40.png?text=JB", dataAiHintAvatar: "person avatar"} ],
    policies: { checkIn: "After 2:00 PM", checkOut: "Before 10:00 AM", cancellation: "Non-refundable." },
    neighborhoodInsights: { walkabilityScore: 99, crimeRate: "Medium", nearbySchools: "N/A", publicTransport: "Excellent (Metro, Bus)" }
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
    image: "https://placehold.co/600x400.png?text=Camry+Hybrid",
    photos: [
      { id: "car1p1", src: "https://placehold.co/800x600.png", alt: "Camry front view", dataAiHint: "sedan front" },
      { id: "car1p2", src: "https://placehold.co/400x300.png", alt: "Camry interior", dataAiHint: "car dashboard" },
      { id: "car1p3", src: "https://placehold.co/400x300.png", alt: "Camry side view", dataAiHint: "sedan side" },
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
    image: "https://placehold.co/600x400.png?text=Ford+Explorer",
    photos: [
      { id: "car2p1", src: "https://placehold.co/800x600.png", alt: "Explorer front view", dataAiHint: "suv front" },
      { id: "car2p2", src: "https://placehold.co/400x300.png", alt: "Explorer interior with third row", dataAiHint: "suv interior seats" },
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
    image: "https://placehold.co/600x400.png?text=Sprinter+Van",
     photos: [
      { id: "car3p1", src: "https://placehold.co/800x600.png", alt: "Sprinter van exterior", dataAiHint: "white van" },
      { id: "car3p2", src: "https://placehold.co/400x300.png", alt: "Sprinter van interior seating", dataAiHint: "van interior" },
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
    image: "https://placehold.co/600x400.png?text=Downtown+Loft", 
    dataAiHint: "loft apartment", 
    virtualTourLink: "#", 
    floorPlanLink: "#", 
    walkabilityScore: 95, 
    nearbySchools: "City High, Downtown Elementary", 
    utilitiesIncluded: "Water, Trash", 
    isEcoFriendly: true,
    description: "A stylish and modern loft apartment in the heart of downtown. Features high ceilings, large windows, and access to building amenities like a gym and pool. Perfect for urban living.",
    rating: 4.7,
    reviewsCount: 55,
    photos: [
        { id: "p1r1", src: "https://placehold.co/800x600.png?text=Loft+Living", alt: "Loft living area", dataAiHint: "loft interior" },
        { id: "p2r1", src: "https://placehold.co/400x300.png?text=Loft+Kitchen", alt: "Loft kitchen", dataAiHint: "modern kitchen" },
    ],
    host: { name: "Urban Living Inc.", avatar: "https://placehold.co/100x100.png?text=UL", dataAiHint: "company logo" }
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
    image: "https://placehold.co/600x400.png?text=Suburban+House", 
    dataAiHint: "family house suburban", 
    virtualTourLink: "#", 
    floorPlanLink: "#", 
    walkabilityScore: 70, 
    nearbySchools: "Greenwood High, Meadowbrook Elementary", 
    utilitiesIncluded: "None", 
    isEcoFriendly: false,
    description: "Spacious family home in a quiet suburban neighborhood. Large backyard, two-car garage, and pet-friendly policy. Close to parks and good schools.",
    rating: 4.5,
    reviewsCount: 30,
    photos: [ { id: "p1r2", src: "https://placehold.co/800x600.png?text=Family+House+Exterior", alt: "Family house exterior", dataAiHint: "suburban house" } ],
    host: { name: "Sarah Miller", avatar: "https://placehold.co/100x100.png?text=SM", dataAiHint: "woman portrait" }
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
    image: "https://placehold.co/600x400.png?text=Modern+Townhouse", 
    dataAiHint: "modern townhouse", 
    virtualTourLink: "#", 
    floorPlanLink: "#", 
    walkabilityScore: 85, 
    nearbySchools: "Northwood Academy", 
    utilitiesIncluded: "Internet", 
    isEcoFriendly: true,
    description: "Contemporary townhouse with a private rooftop deck and smart home features. Two bedrooms, open-plan living, and close to city amenities.",
    rating: 4.6,
    reviewsCount: 42,
    photos: [ { id: "p1r3", src: "https://placehold.co/800x600.png?text=Townhouse+Rooftop", alt: "Townhouse rooftop deck", dataAiHint: "rooftop deck city" } ],
    host: { name: "Tech Homes LLC", avatar: "https://placehold.co/100x100.png?text=TH", dataAiHint: "company logo" }
  },
];

export const mockSaleProperties: MockStay[] = [
  { 
    id: "sale1", 
    name: "Spacious Family Home", 
    price: 350000, 
    pricePerNight: 0, // Not applicable for sale
    location: "Green Valley", 
    propertyType: "House", 
    type: "Rental", // This should probably be 'Sale' or a new type
    category: "House",
    sizeSqft: "2200 sqft", 
    zoning: "Residential", 
    image: "https://placehold.co/600x400.png?text=Family+Home", 
    dataAiHint: "family house", 
    status: "Verified", 
    lastSalePrice: 280000, 
    marketTrend: "+5% YoY",
    description: "A beautiful and spacious family home located in the desirable Green Valley neighborhood. Features 4 bedrooms, 2.5 bathrooms, a large kitchen, and a well-maintained backyard. Perfect for a growing family.",
    bedrooms: 4,
    bathrooms: 2.5,
    rating: 4.8, // Added for consistency if needed
    amenities: ["Backyard", "Garage", "Updated Kitchen"],
    photos: [ { id: "p1sa1", src: "https://placehold.co/800x600.png?text=Sale+Home+Exterior", alt: "Sale home exterior", dataAiHint: "house exterior sale" } ],
    host: { name: "Real Estate Pro", avatar: "https://placehold.co/100x100.png?text=RE", dataAiHint: "agent portrait" }
  },
  { 
    id: "sale2", 
    name: "Prime Commercial Land", 
    price: 1200000, 
    pricePerNight: 0,
    location: "Downtown Core", 
    propertyType: "Land", 
    type: "Rental", // This should probably be 'Sale'
    category: "Land",
    sizeAcres: "2 acres", 
    zoning: "Commercial", 
    image: "https://placehold.co/600x400.png?text=Commercial+Land", 
    dataAiHint: "empty lot", 
    status: "Title Deed Uploaded", 
    lastSalePrice: 950000, 
    marketTrend: "+8% YoY",
    description: "An exceptional opportunity to acquire 2 acres of prime commercial land in the bustling Downtown Core. High traffic area with excellent development potential for retail, office, or mixed-use projects.",
    rating: 4.5, // Added
    amenities: ["Road Frontage", "Utilities Nearby"],
    photos: [ { id: "p1sa2", src: "https://placehold.co/800x600.png?text=Land+Plot+Aerial", alt: "Land plot aerial view", dataAiHint: "land aerial" } ],
    host: { name: "Land Investments Co.", avatar: "https://placehold.co/100x100.png?text=LI", dataAiHint: "company logo" }
  },
  { 
    id: "sale3", 
    name: "Modern Downtown Apartment", 
    price: 450000, 
    pricePerNight: 0,
    location: "City Center", 
    propertyType: "Apartment", 
    type: "Rental", // This should probably be 'Sale'
    category: "Apartment",
    sizeSqft: "1200 sqft", 
    zoning: "Residential", 
    image: "https://placehold.co/600x400.png?text=Modern+Apartment", 
    dataAiHint: "apartment building", 
    status: "Leasehold", 
    lastSalePrice: 400000, 
    marketTrend: "+3% YoY",
    description: "A sleek and modern apartment in a prime city center location. This 2-bedroom, 2-bathroom unit offers stunning city views, high-end finishes, and access to building amenities including a fitness center and concierge.",
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.9, // Added
    amenities: ["City Views", "Fitness Center", "Concierge"],
    photos: [ { id: "p1sa3", src: "https://placehold.co/800x600.png?text=Apartment+Sale+Interior", alt: "Apartment sale interior", dataAiHint: "modern apartment interior" } ],
    host: { name: "City Living Sales", avatar: "https://placehold.co/100x100.png?text=CS", dataAiHint: "agent portrait" }
  },
];

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
