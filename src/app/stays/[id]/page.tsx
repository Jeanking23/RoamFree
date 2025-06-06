
// src/app/stays/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Star, MapPin, CreditCard, MessageSquare, ShieldCheck, Camera, Share2, Heart, AlertTriangle, Car, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// Mock data - in a real app, you'd fetch this based on params.id
const mockAccommodation = {
  id: "123",
  name: "Luxury Beachfront Paradise Villa",
  location: "Malibu, California",
  type: "Villa",
  pricePerNight: 750,
  rating: 4.9,
  reviewsCount: 182,
  description: "Experience ultimate luxury in this stunning beachfront villa. Offering breathtaking ocean views, a private infinity pool, and direct beach access. Perfect for families or romantic getaways. Features 4 bedrooms, 5 bathrooms, a gourmet kitchen, and expansive outdoor living spaces.",
  amenities: ["Private Pool", "Beachfront", "WiFi", "Air Conditioning", "Full Kitchen", "Free Parking", "Gym Access"],
  photos: [
    { id: "p1", src: "https://placehold.co/800x600.png?text=Villa+View+1", alt: "Villa ocean view", dataAiHint: "luxury villa ocean" },
    { id: "p2", src: "https://placehold.co/400x300.png?text=Pool", alt: "Infinity pool", dataAiHint: "infinity pool" },
    { id: "p3", src: "https://placehold.co/400x300.png?text=Bedroom", alt: "Master bedroom", dataAiHint: "luxury bedroom" },
    { id: "p4", src: "https://placehold.co/400x300.png?text=Living+Area", alt: "Spacious living area", dataAiHint: "living room modern" },
    { id: "p5", src: "https://placehold.co/400x300.png?text=Kitchen", alt: "Gourmet kitchen", dataAiHint: "modern kitchen" },
  ],
  host: { name: "Katherine Bishop", avatar: "https://placehold.co/100x100.png?text=KB", dataAiHint: "woman portrait" },
  guestReviews: [
    { id: "r1", user: "Alice Martin", rating: 5, comment: "Absolutely phenomenal stay! The villa exceeded all expectations. Views were incredible and the host was very responsive.", date: "2024-03-15" },
    { id: "r2", user: "Bob Williams", rating: 4, comment: "Great location and beautiful property. Pool was amazing. Minor issue with WiFi initially but was resolved quickly.", date: "2024-02-20" },
  ],
  availability: "Check availability calendar (placeholder)", // Placeholder
  policies: { checkIn: "After 3:00 PM", checkOut: "Before 11:00 AM", cancellation: "Flexible - Free cancellation up to 5 days before check-in." }
};

export default function AccommodationProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState(mockAccommodation.photos[0]);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();

  // In a real app, fetch data based on params.id
  // For now, we use mockAccommodation regardless of ID.
  // Add useEffect to handle if no accommodation found for a real ID.
  useEffect(() => {
    if (params.id !== mockAccommodation.id) {
      // console.warn("Displaying mock data as ID doesn't match. In a real app, fetch or show 404.");
    }
    setCurrentImage(mockAccommodation.photos[0]);
  }, [params.id]);


  const handleBookNow = () => {
    toast({ title: "Booking Initiated (Demo)", description: `Proceeding to payment for ${mockAccommodation.name}. This is a placeholder.` });
    // Simulate payment or navigation to a payment page
  };

  const handleContactHost = ()_ => {
    toast({ title: "Contact Host (Demo)", description: `Opening chat with ${mockAccommodation.host.name}. This is a placeholder.`});
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockAccommodation.name,
        text: `Check out this amazing place: ${mockAccommodation.name}`,
        url: window.location.href,
      }).then(() => toast({ title: "Shared successfully!"}))
        .catch(error => console.error('Error sharing:', error));
    } else {
      toast({ title: "Share", description: "Web Share API not supported. You can copy the URL.", variant: "default"});
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({ title: isFavorited ? "Removed from Wishlist" : "Added to Wishlist" });
  };
  
  const handleArView = () => {
    toast({ title: "Augmented Reality View", description: "AR view feature is under development. This would use your phone's camera. (Placeholder)" });
  };

  const handleSuggestRides = () => {
    const now = new Date();
    toast({
      title: "Ride Suggestions (Demo)",
      description: `Uber: ETA 5 mins, Fare ~$25. Lyft: ETA 7 mins, Fare ~$23. Recommended departure for airport: ${new Date(now.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. (Current time: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`,
      duration: 10000,
    });
  };

  if (!mockAccommodation) {
    return <div>Loading accommodation details...</div>; // Or a 404 component
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{mockAccommodation.name}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-5 w-5" /> <span>{mockAccommodation.location}</span>
                <Separator orientation="vertical" className="h-5" />
                <Star className="h-5 w-5 text-yellow-400" /> <span>{mockAccommodation.rating} ({mockAccommodation.reviewsCount} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button variant="ghost" size="icon" onClick={handleToggleFavorite} aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}>
                <Heart className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                <Share2 className="h-6 w-6 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Image Gallery */}
        <CardContent className="px-0 md:px-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:max-h-[500px] overflow-hidden rounded-md">
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer" onClick={() => setCurrentImage(mockAccommodation.photos[0])}>
              <Image src={currentImage.src} alt={currentImage.alt} layout="fill" objectFit="cover" className="rounded-l-md" data-ai-hint={currentImage.dataAiHint} />
            </div>
            {mockAccommodation.photos.slice(1, 5).map((photo, index) => (
              <div key={photo.id} className={`relative aspect-[4/3] md:aspect-auto cursor-pointer ${index > 1 ? 'hidden md:block' : ''}`} onClick={() => setCurrentImage(photo)}>
                <Image src={photo.src} alt={photo.alt} layout="fill" objectFit="cover" className={index === 1 ? "md:rounded-tr-md" : index === 3 ? "md:rounded-br-md" : ""} data-ai-hint={photo.dataAiHint} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto p-2 md:hidden">
             {mockAccommodation.photos.map(photo => (
                 <Image key={photo.id} src={photo.src} alt={photo.alt} width={80} height={60} className={`rounded object-cover cursor-pointer ${currentImage.id === photo.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setCurrentImage(photo)} data-ai-hint={photo.dataAiHint}/>
             ))}
          </div>
           <div className="text-center mt-2">
             <Button variant="outline" onClick={handleArView}><Camera className="mr-2 h-4 w-4" /> Try AR View (Demo)</Button>
           </div>
        </CardContent>
        
        <Separator className="my-6" />

        {/* Main Content Area (Description, Booking, Host) */}
        <CardContent className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Description & Amenities */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">About this {mockAccommodation.type.toLowerCase()}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{mockAccommodation.description}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Amenities</h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground">
                {mockAccommodation.amenities.map(amenity => (
                  <li key={amenity} className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {amenity}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Policies</h3>
              <p className="text-sm text-muted-foreground"><strong>Check-in:</strong> {mockAccommodation.policies.checkIn}</p>
              <p className="text-sm text-muted-foreground"><strong>Check-out:</strong> {mockAccommodation.policies.checkOut}</p>
              <p className="text-sm text-muted-foreground"><strong>Cancellation:</strong> {mockAccommodation.policies.cancellation}</p>
            </div>
            <div className="md:hidden"> {/* Show host info earlier on mobile */}
              <Separator className="my-6" />
              <HostInfo />
              <Separator className="my-6" />
            </div>
          </div>

          {/* Right Column: Booking Card & Host Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">${mockAccommodation.pricePerNight} <span className="text-base font-normal text-muted-foreground">/ night</span></CardTitle>
                <CardDescription>{mockAccommodation.availability}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date pickers placeholder */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="checkin" className="block text-sm font-medium text-muted-foreground">Check-in</label>
                    <Input type="date" id="checkin" onChange={(e) => setCheckInDate(new Date(e.target.value))} />
                  </div>
                  <div>
                    <label htmlFor="checkout" className="block text-sm font-medium text-muted-foreground">Check-out</label>
                    <Input type="date" id="checkout" onChange={(e) => setCheckOutDate(new Date(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-muted-foreground">Guests</label>
                  <Input type="number" id="guests" defaultValue="2" min="1" />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleBookNow}>
                  <CreditCard className="mr-2 h-5 w-5" /> Book Now
                </Button>
                 <p className="text-xs text-muted-foreground text-center">You won't be charged yet (This is a demo)</p>
              </CardContent>
            </Card>

            <div className="hidden md:block"> {/* Hide host info here on mobile */}
              <HostInfo />
            </div>

            <Card className="shadow-md border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Car className="h-5 w-5"/> Transportation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Need a ride to/from here or around town?</p>
                    <Button variant="outline" className="w-full mb-2" onClick={handleSuggestRides}>
                       <Clock className="mr-2 h-4 w-4"/> Suggest Rides (Demo)
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" className="w-full" asChild><a href="https://m.uber.com" target="_blank" rel="noopener noreferrer">Open Uber</a></Button>
                        <Button variant="outline" className="w-full" asChild><a href="https://www.lyft.com/rider" target="_blank" rel="noopener noreferrer">Open Lyft</a></Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2">Real-time info & dynamic suggestions based on your booking (if applicable) would appear here.</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
        
        <Separator className="my-6" />

        {/* Reviews Section */}
        <CardContent>
          <h3 className="text-2xl font-semibold mb-4">Guest Reviews ({mockAccommodation.reviewsCount})</h3>
          <div className="space-y-6">
            {mockAccommodation.guestReviews.map(review => (
              <Card key={review.id} className="bg-muted/30">
                <CardHeader className="flex flex-row justify-between items-center pb-2">
                  <div className="flex items-center gap-2">
                    <Image src={`https://placehold.co/40x40.png?text=${review.user.substring(0,1)}`} alt={review.user} width={40} height={40} className="rounded-full" data-ai-hint="person avatar" />
                    <div>
                      <p className="font-semibold">{review.user}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline">Show all {mockAccommodation.reviewsCount} reviews</Button>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-orange-500"/>
                <span>Report this listing if you find any issues. (Placeholder)</span>
            </div>
             <p className="text-xs text-muted-foreground">Calendar sync with Google/Apple Calendar and host platform sync (Airbnb, etc.) are planned features.</p>
             <p className="text-xs text-muted-foreground">Offline access for bookings and key details is a planned feature.</p>
             <p className="text-xs text-muted-foreground">Push notifications for price drops, availability, or trip reminders are planned.</p>
        </CardFooter>
      </Card>
    </div>
  );
}


function HostInfo() {
  const handleContactHost = ()_ => {
    toast({ title: "Contact Host (Demo)", description: `Opening chat with ${mockAccommodation.host.name}. This is a placeholder.`});
  }
  return (
    <Card className="border bg-background shadow-md">
        <CardHeader className="text-center">
        <Image src={mockAccommodation.host.avatar} alt={mockAccommodation.host.name} width={80} height={80} className="rounded-full mx-auto mb-2" data-ai-hint={mockAccommodation.host.dataAiHint} />
        <CardTitle className="text-xl">Hosted by {mockAccommodation.host.name}</CardTitle>
        <CardDescription>Superhost (Placeholder)</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
        <Button variant="outline" className="w-full" onClick={handleContactHost}>
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Host
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Response rate: 99% (Placeholder)</p>
        </CardContent>
    </Card>
  );
}

    