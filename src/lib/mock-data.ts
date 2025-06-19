
// src/lib/mock-data.ts
import type { BedDouble, MapPin, Star, Lightbulb, Hotel, Building2, Home as HomeIconType, Bed, Search, History, TrendingUp, Sparkles, Waves, MountainSnow, Users, Percent, Clock, Bell, MessageSquare, UserCircle, LayoutDashboard, Heart, Award, Building as BuildingIconType, KeyRound, Landmark as LandmarkIconType, ClipboardList, Truck, CarFront as CarSaleIconType, Plane, TvIcon, Layers, School, Leaf, CheckCircle, CalendarDays, DollarSign } from 'lucide-react';

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
    moods: ["Peaceful", "Romantic", "Adventurous"],
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
