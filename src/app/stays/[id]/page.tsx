// src/app/stays/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Star, MapPin, CreditCard, MessageSquare, ShieldCheck, Camera, Share2, Heart, AlertTriangle, Car, Clock, CheckCircle, Landmark as LandmarkIcon, CloudSun, Calendar, Info, Plane, Percent, TvIcon, Contact, Waves, Layers, HomeIcon as HomeIconLucide, School, Building as BuildingIconLucide, Leaf, BadgeCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { allMockStays, type MockStay, type Host, type StayPhoto } from '@/lib/mock-data';
import { addDays, differenceInDays } from 'date-fns';

// Mock data for nearby attractions (can be dynamic based on currentStay.location in a real app)
const mockNearbyAttractions = [
  { id: "attr1", name: "Local Landmark Example", category: "Landmark", image: "https://placehold.co/300x200.png?text=Nearby+Landmark", dataAiHint:"landmark historic", distance: "0.5 miles" },
  { id: "attr2", name: "Popular Park Example", category: "Nature", image: "https://placehold.co/300x200.png?text=Nearby+Park", dataAiHint:"park nature", distance: "3 miles" },
  { id: "attr3", name: "Famous Restaurant Example", category: "Dining", image: "https://placehold.co/300x200.png?text=Nearby+Restaurant", dataAiHint:"restaurant food", distance: "1 mile" },
];

export default function AccommodationProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [currentStay, setCurrentStay] = useState<MockStay | null | undefined>(undefined); // undefined for loading, null for not found
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState<StayPhoto | null>(null);
  
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // This avoids a hydration mismatch between server-rendered and client-rendered HTML.
    setHasMounted(true);
    setCheckInDate(new Date());
    setCheckOutDate(addDays(new Date(), 7));
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (params.id) {
      const stayId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundStay = allMockStays.find(s => s.id === stayId);
      if (foundStay) {
        setCurrentStay(foundStay);
        if (foundStay.photos && foundStay.photos.length > 0) {
          setCurrentImage(foundStay.photos[0]);
        } else {
           setCurrentImage({id: 'placeholder', src: foundStay.image, alt: foundStay.name, dataAiHint: foundStay.dataAiHint});
        }
      } else {
        setCurrentStay(null); // Not found
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (currentStay && checkInDate && checkOutDate && checkOutDate > checkInDate) {
      const nights = differenceInDays(checkOutDate, checkInDate);
      if (nights > 0) {
        setTotalPrice(nights * currentStay.pricePerNight);
      } else {
        setTotalPrice(null);
      }
    } else {
      setTotalPrice(null);
    }
  }, [currentStay, checkInDate, checkOutDate]);


  const handleBookNow = () => {
    if (!currentStay) return;
    let bookingDetails = `for ${currentStay.name}`;
    if (checkInDate && checkOutDate) {
      bookingDetails += ` from ${checkInDate.toLocaleDateString()} to ${checkOutDate.toLocaleDateString()}`;
    }
    if (numberOfGuests > 0) {
      bookingDetails += ` for ${numberOfGuests} guest(s)`;
    }
    if (totalPrice !== null) {
      bookingDetails += `. Total: $${totalPrice.toFixed(2)}`;
    }
    toast({ title: "Booking Initiated (Demo)", description: `Proceeding to payment ${bookingDetails}. Secure Escrow & Buy Now, Pay Later options available.` });
  };

  const handleContactHost = () => {
    if (!currentStay?.host) return;
    toast({ title: "Contact Host (Demo)", description: `Opening chat with ${currentStay.host.name}. This is a placeholder.`});
  }
  
  const handleShare = () => {
    if (!currentStay) return;
    if (navigator.share) {
      navigator.share({
        title: currentStay.name,
        text: `Check out this amazing place: ${currentStay.name}`,
        url: window.location.href,
      }).then(() => toast({ title: "Shared successfully!"}))
        .catch(error => console.error('Error sharing:', error));
    } else {
      toast({ title: "Share", description: "Web Share API not supported. You can copy the URL."});
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({ title: isFavorited ? "Removed from Wishlist" : "Added to Wishlist" });
  };
  
  const handleArView = () => {
    toast({ title: "Augmented Reality View (Demo)", description: "AR property walkthrough feature using your phone's camera is under development." });
  };
  
  const handle360Tour = () => {
    if (!currentStay) return;
    const description = currentStay.virtualTourLink 
      ? `Starting immersive 360° video tour for ${currentStay.name} via ${currentStay.virtualTourLink}.`
      : `Starting immersive 360° video tour for ${currentStay.name}. (Placeholder: No specific link for this stay)`;
    toast({ title: "360° Video Tour (Demo)", description });
  };

  const handleDroneView = () => {
    toast({ title: "Drone View (Demo)", description: "Displaying top-down drone footage of the property area. (Placeholder)" });
  };

  const handleFloorPlan = () => {
    if (!currentStay) return;
     const description = currentStay.floorPlanLink
      ? `Showing clickable 3D floor plan for ${currentStay.name} via ${currentStay.floorPlanLink}. (Room dimensions available)`
      : `Showing clickable 3D floor plan for ${currentStay.name}. (Placeholder: No specific link for this stay)`;
    toast({ title: "Interactive Floor Plan (Demo)", description });
  };

  const handleSuggestRides = () => {
    const now = new Date();
    toast({
      title: "Ride Suggestions (Demo)",
      description: `Uber: ETA 5 mins, Fare ~$25. Lyft: ETA 7 mins, Fare ~$23. Recommended departure for airport: ${new Date(now.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. (Current time: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}) Based on your flight arrival (if provided).`,
      duration: 10000,
    });
  };

  if (currentStay === undefined) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading accommodation details...</div>; 
  }
  if (currentStay === null) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-semibold mb-4">Accommodation Not Found</h1>
            <p className="text-muted-foreground mb-4">The stay you are looking for does not exist or may have been removed.</p>
            <Button onClick={() => router.push('/')}>Go to Homepage</Button>
        </div>
    );
  }
  
  const displayPhotos = currentStay.photos && currentStay.photos.length > 0 ? currentStay.photos : [{id: 'main', src: currentStay.image, alt: currentStay.name, dataAiHint: currentStay.dataAiHint}];


  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{currentStay.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground mt-1">
                <span className="flex items-center"><MapPin className="h-5 w-5 mr-1" /> {currentStay.location}</span>
                <Separator orientation="vertical" className="h-5 hidden sm:block" />
                <span className="flex items-center"><Star className="h-5 w-5 text-yellow-400 mr-1" /> {currentStay.rating} ({currentStay.reviewsCount || 0} reviews)</span>
                 {currentStay.isEcoFriendly && <><Separator orientation="vertical" className="h-5 hidden sm:block" /><Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300"><Leaf className="mr-1 h-3 w-3"/>Eco-Friendly</Badge></>}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0 self-start">
              <Button variant="ghost" size="icon" onClick={handleToggleFavorite} aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}>
                <Heart className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                <Share2 className="h-6 w-6 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 md:px-6 pt-0">
           <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:max-h-[500px] overflow-hidden rounded-md">
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer" onClick={() => currentImage && setCurrentImage(displayPhotos[0])}>
              {currentImage && <Image src={currentImage.src} alt={currentImage.alt} layout="fill" objectFit="cover" className="rounded-l-md" data-ai-hint={currentImage.dataAiHint} />}
            </div>
            {displayPhotos.slice(1, 5).map((photo, index) => (
              <div key={photo.id} className={`relative aspect-[4/3] md:aspect-auto cursor-pointer ${index > 1 ? 'hidden md:block' : ''}`} onClick={() => setCurrentImage(photo)}>
                <Image src={photo.src} alt={photo.alt} layout="fill" objectFit="cover" className={index === 1 ? "md:rounded-tr-md" : index === 3 ? "md:rounded-br-md" : ""} data-ai-hint={photo.dataAiHint} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto p-2 md:hidden">
             {displayPhotos.map(photo => (
                 <Image key={photo.id} src={photo.src} alt={photo.alt} width={80} height={60} className={`rounded object-cover cursor-pointer ${currentImage?.id === photo.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setCurrentImage(photo)} data-ai-hint={photo.dataAiHint}/>
             ))}
          </div>
           <div className="flex flex-wrap gap-2 justify-center mt-4">
             <Button variant="outline" onClick={handleArView}><Camera className="mr-2 h-4 w-4" /> Try AR View (Demo)</Button>
             <Button variant="outline" onClick={handle360Tour} disabled={!currentStay.virtualTourLink}><TvIcon className="mr-2 h-4 w-4" /> 360° Video Tour</Button>
             <Button variant="outline" onClick={handleDroneView}><Plane className="mr-2 h-4 w-4" /> Drone View (Demo)</Button>
             <Button variant="outline" onClick={handleFloorPlan} disabled={!currentStay.floorPlanLink}><Layers className="mr-2 h-4 w-4" /> Interactive Floor Plan</Button>
           </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">About this {currentStay.category.toLowerCase()}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{currentStay.description}</p>
            </div>
             {currentStay.amenities && currentStay.amenities.length > 0 && (
                <div>
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground">
                    {currentStay.amenities.map(amenity => (
                    <li key={amenity} className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {amenity}</li>
                    ))}
                </ul>
                </div>
            )}
            {currentStay.policies && (
                <div>
                <h3 className="text-xl font-semibold mb-3">Policies</h3>
                <p className="text-sm text-muted-foreground"><strong>Check-in:</strong> {currentStay.policies.checkIn}</p>
                <p className="text-sm text-muted-foreground"><strong>Check-out:</strong> {currentStay.policies.checkOut}</p>
                <p className="text-sm text-muted-foreground"><strong>Cancellation:</strong> {currentStay.policies.cancellation}</p>
                </div>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CloudSun className="h-5 w-5"/> Smart Trip Info (Demo)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-1"><CloudSun className="h-4 w-4 text-blue-500"/> Weather: Sunny, 24°C. Perfect for the beach! (Dynamic weather integration demo)</p>
                <p className="flex items-center gap-1"><Calendar className="h-4 w-4 text-purple-500"/> Local Event: Malibu Arts Festival (This Weekend) (Local event discovery demo)</p>
                <p className="flex items-center gap-1"><Info className="h-4 w-4 text-orange-500"/> Cultural Tip: Tipping at restaurants is customary (15-20%). (Travel advisory demo)</p>
              </CardContent>
            </Card>

            {currentStay.neighborhoodInsights && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HomeIconLucide className="h-5 w-5"/> Neighborhood Insights (Demo)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Walkability Score:</strong> {currentStay.neighborhoodInsights.walkabilityScore}/100</p>
                        <p><strong>Crime Rate:</strong> {currentStay.neighborhoodInsights.crimeRate}</p>
                        <p className="flex items-center gap-1"><School className="h-4 w-4"/><strong>Nearby Schools:</strong> {currentStay.neighborhoodInsights.nearbySchools}</p>
                        <p className="flex items-center gap-1"><BuildingIconLucide className="h-4 w-4"/><strong>Public Transport:</strong> {currentStay.neighborhoodInsights.publicTransport}</p>
                    </CardContent>
                </Card>
            )}
            
            <div className="md:hidden"> 
              <Separator className="my-6" />
              {currentStay.host && <HostInfo host={currentStay.host} onContact={handleContactHost} />}
              <Separator className="my-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold my-4">Nearby Attractions (Demo)</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {mockNearbyAttractions.map(attraction => (
                  <Card key={attraction.id} className="overflow-hidden">
                    <Link href={`/attractions/${attraction.id}`} className="block relative w-full h-32 group">
                        <Image src={attraction.image} alt={attraction.name} layout="fill" objectFit="cover" data-ai-hint={attraction.dataAiHint}/>
                         <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <LandmarkIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-75 transition-opacity" />
                        </div>
                    </Link>
                    <CardHeader className="p-3">
                      <CardTitle className="text-base hover:text-primary">
                        <Link href={`/attractions/${attraction.id}`}>{attraction.name}</Link>
                      </CardTitle>
                      <CardDescription className="text-xs">{attraction.category} &bull; {attraction.distance}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
               <Button variant="link" asChild className="mt-2 px-0"><Link href="/attractions">Explore more attractions</Link></Button>
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">${currentStay.pricePerNight} <span className="text-base font-normal text-muted-foreground">/ night</span></CardTitle>
                <CardDescription>{currentStay.availability || "Check dates for availability."} (Calendar sync - Demo)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="checkin" className="block text-sm font-medium text-muted-foreground">Check-in</label>
                    <Input 
                        type="date" 
                        id="checkin" 
                        value={checkInDate ? checkInDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setCheckInDate(e.target.value ? new Date(e.target.value) : undefined)} 
                        min={hasMounted ? new Date().toISOString().split('T')[0] : undefined}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout" className="block text-sm font-medium text-muted-foreground">Check-out</label>
                    <Input 
                        type="date" 
                        id="checkout" 
                        value={checkOutDate ? checkOutDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setCheckOutDate(e.target.value ? new Date(e.target.value) : undefined)}
                        min={hasMounted && checkInDate ? addDays(checkInDate, 1).toISOString().split('T')[0] : undefined}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-muted-foreground">Guests</label>
                  <Input 
                    type="number" 
                    id="guests" 
                    value={numberOfGuests} 
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value, 10) || 1)}
                    min="1" 
                    max={currentStay.maxGuests || 10} 
                  />
                </div>
                {totalPrice !== null && (
                  <div className="pt-2">
                    <p className="text-lg font-semibold">Total Price: <span className="text-primary">${totalPrice.toFixed(2)}</span></p>
                    <p className="text-xs text-muted-foreground">For {differenceInDays(checkOutDate || new Date(), checkInDate || new Date())} night(s)</p>
                  </div>
                )}
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" 
                  onClick={handleBookNow}
                  disabled={!checkInDate || !checkOutDate || (checkOutDate <= checkInDate)}
                >
                  <CreditCard className="mr-2 h-5 w-5" /> Book Now
                </Button>
                 <p className="text-xs text-muted-foreground text-center">You won't be charged yet (This is a demo)</p>
                 <p className="text-xs text-muted-foreground text-center">Split Payment & Secure Escrow Available (Demo)</p>
                 <p className="text-xs text-muted-foreground text-center">Pay with Klarna/Afterpay (Demo)</p>
              </CardContent>
            </Card>

            <div className="hidden md:block">
             {currentStay.host && <HostInfo host={currentStay.host} onContact={handleContactHost} />}
            </div>

            <Card className="shadow-md border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Car className="h-5 w-5"/> Transportation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Need a ride? Auto-suggestions based on flight arrivals (Demo).</p>
                    <Button variant="outline" className="w-full mb-2" onClick={handleSuggestRides}>
                       <Clock className="mr-2 h-4 w-4"/> Suggest Rides (Demo)
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" className="w-full" asChild><a href="https://m.uber.com" target="_blank" rel="noopener noreferrer">Open Uber</a></Button>
                        <Button variant="outline" className="w-full" asChild><a href="https://www.lyft.com/rider" target="_blank" rel="noopener noreferrer">Open Lyft</a></Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent>
          <h3 className="text-2xl font-semibold mb-4">Guest Reviews ({currentStay.reviewsCount || 0})</h3>
          <div className="space-y-6">
            {currentStay.guestReviews && currentStay.guestReviews.length > 0 ? currentStay.guestReviews.map(review => (
              <Card key={review.id} className="bg-muted/30">
                <CardHeader className="flex flex-row justify-between items-center pb-2">
                  <div className="flex items-center gap-2">
                    <Image src={review.avatar || `https://placehold.co/40x40.png?text=${review.user.substring(0,1)}`} alt={review.user} width={40} height={40} className="rounded-full" data-ai-hint={review.dataAiHintAvatar || "person avatar"} />
                    <div>
                      <p className="font-semibold">{review.user}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                        <BadgeCheck className="h-3 w-3 text-green-500" title="Verified Review"/>
                      </div>
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
            )) : <p className="text-muted-foreground">No reviews yet for this property.</p>}
            {currentStay.guestReviews && currentStay.guestReviews.length > 0 && <Button variant="outline">Show all {currentStay.reviewsCount} reviews (Demo)</Button>}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-orange-500"/>
                <span>Report this listing if you find any issues. (Placeholder)</span>
            </div>
             <p className="text-xs text-muted-foreground">Calendar sync (Google/Apple/Airbnb) & Offline access for bookings are planned features.</p>
             <p className="text-xs text-muted-foreground">Push notifications (price drops, trip reminders, traffic, weather) are planned.</p>
        </CardFooter>
      </Card>
    </div>
  );
}


interface HostInfoProps {
  host: Host;
  onContact: () => void;
}
function HostInfo({ host, onContact }: HostInfoProps) {
  return (
    <Card className="border bg-background shadow-md">
        <CardHeader className="text-center">
        <Image src={host.avatar} alt={host.name} width={80} height={80} className="rounded-full mx-auto mb-2" data-ai-hint={host.dataAiHint} />
        <CardTitle className="text-xl">Hosted by {host.name}</CardTitle>
        <CardDescription>Superhost (Placeholder)</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
        <Button variant="outline" className="w-full" onClick={onContact}>
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Host
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Response rate: 99% (Placeholder)</p>
        </CardContent>
    </Card>
  );
}
