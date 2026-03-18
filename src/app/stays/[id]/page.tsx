
// src/app/stays/[id]/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { getStayById } from '@/services/stays';
import { type MockStay, type Host, type StayPhoto } from '@/lib/mock-data';
import { addDays, differenceInDays, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for nearby attractions (can be dynamic based on currentStay.location in a real app)
const mockNearbyAttractions = [
  { id: "attr1", name: "Local Landmark Example", category: "Landmark", image: "https://images.unsplash.com/photo-1723126906308-d42e5941f343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsYW5kbWFyayUyMGhpc3RvcmljfGVufDB8fHx8MTc1MjcyODIzNnww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint:"landmark historic", distance: "0.5 miles" },
  { id: "attr2", name: "Popular Park Example", category: "Nature", image: "https://images.unsplash.com/photo-1678195057327-78b9d245de36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwYXJrJTIwbmF0dXJlfGVufDB8fHx8MTc1MjcyODIzNnww&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint:"park nature", distance: "3 miles" },
  { id: "attr3", name: "Famous Restaurant Example", category: "Dining", image: "https://images.unsplash.com/photo-1502998070258-dc1338445ac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxyZXN0YXVyYW50JTIwZm9vZHxlbnwwfHx8fDE3NTI3MjgyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080", dataAiHint:"restaurant food", distance: "1 mile" },
];

async function getStayData(id: string): Promise<MockStay | null> {
    try {
        const stay = await getStayById(id);
        return stay;
    } catch (error) {
        console.error("Failed to fetch stay:", error);
        return null;
    }
}

export default function AccommodationProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [currentStay, setCurrentStay] = useState<MockStay | null | undefined>(undefined);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState<StayPhoto | null>(null);
  
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [formattedReviewDates, setFormattedReviewDates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setHasMounted(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCheckInDate(today);
    setCheckOutDate(addDays(today, 7));
  }, []); 
  
   useEffect(() => {
    async function fetchStay() {
        const stayData = await getStayData(id);
        setCurrentStay(stayData);
        if (stayData) {
            if (stayData.photos && stayData.photos.length > 0) {
                setCurrentImage(stayData.photos[0]);
            } else {
                setCurrentImage({id: 'placeholder', src: stayData.image, alt: stayData.name, dataAiHint: stayData.dataAiHint});
            }
        }
    }
    fetchStay();
  }, [id]);


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

  useEffect(() => {
    if (currentStay?.guestReviews) {
      const dates = currentStay.guestReviews.reduce((acc, review) => {
        acc[review.id] = new Date(review.date).toLocaleDateString();
        return acc;
      }, {} as { [key: string]: string });
      setFormattedReviewDates(dates);
    }
  }, [currentStay]);


  const handleBookNow = () => {
    if (!currentStay) return;
    toast({ title: "Booking Initiated (Demo)", description: "Secure Escrow & Buy Now, Pay Later options available." });
  };

  const handleContactHost = () => {
    if (!currentStay?.host) return;
    toast({ title: "Contact Host (Demo)", description: `Opening chat with ${currentStay.host.name}.`});
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
    toast({ title: "AR View (Demo)", description: "AR property walkthrough is under development." });
  };
  
  const handle360Tour = () => {
    toast({ title: "360° Video Tour (Demo)", description: "Starting immersive 360° video tour." });
  };

  if (currentStay === undefined || !hasMounted) {
    return (
      <div className="space-y-8">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="pb-4"><Skeleton className="h-10 w-3/4" /></CardHeader>
          <CardContent className="px-0 md:px-6 pt-0">
             <Skeleton className="h-[500px] w-full rounded-md" />
          </CardContent>
          <Separator className="my-6" />
          <CardContent className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="md:col-span-1 space-y-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
           <div className="flex flex-col md:flex-row gap-2 h-auto md:h-[450px]">
                <div className="relative w-full md:w-1/2 h-64 md:h-full cursor-pointer" onClick={() => setCurrentImage(displayPhotos[0])}>
                    <Image src={displayPhotos[0].src} alt={displayPhotos[0].alt} fill className="object-cover rounded-lg md:rounded-l-lg md:rounded-r-none" data-ai-hint={displayPhotos[0].dataAiHint} />
                </div>
                <div className="w-full md:w-1/2 grid grid-cols-2 grid-rows-2 gap-2 h-64 md:h-full">
                    {displayPhotos.slice(1, 5).map((photo, index) => (
                    <div key={photo.id} className="relative cursor-pointer" onClick={() => setCurrentImage(photo)}>
                        <Image src={photo.src} alt={photo.alt} fill className={`object-cover ${index === 1 ? 'rounded-tr-lg' : ''} ${index === 3 ? 'rounded-br-lg' : ''}`} data-ai-hint={photo.dataAiHint} />
                    </div>
                    ))}
                </div>
            </div>
           <div className="flex flex-wrap gap-2 justify-center mt-4">
             <Button variant="outline" onClick={handleArView}><Camera className="mr-2 h-4 w-4" /> Try AR View (Demo)</Button>
             <Button variant="outline" onClick={handle360Tour} disabled={!currentStay.virtualTourLink}><TvIcon className="mr-2 h-4 w-4" /> 360° Video Tour</Button>
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
            
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CloudSun className="h-5 w-5"/> Smart Trip Info (Demo)</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-1"><CloudSun className="h-4 w-4 text-blue-500"/> Weather: Sunny, 24°C.</p>
                <p className="flex items-center gap-1"><Calendar className="h-4 w-4 text-purple-500"/> Local Event: Malibu Arts Festival (This Weekend)</p>
              </CardContent>
            </Card>

            <div className="md:hidden"> 
              <Separator className="my-6" />
              {currentStay.host && <HostInfo host={currentStay.host} onContact={handleContactHost} />}
              <Separator className="my-6" />
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">${currentStay.pricePerNight} <span className="text-base font-normal text-muted-foreground">/ night</span></CardTitle>
                <CardDescription>{currentStay.availability || "Check dates for availability."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="checkin" className="block text-sm font-medium text-muted-foreground">Check-in</label>
                    <Input 
                        type="date" id="checkin" 
                        value={checkInDate ? format(checkInDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setCheckInDate(e.target.value ? new Date(e.target.value) : undefined)} 
                        min={hasMounted ? format(new Date(), 'yyyy-MM-dd') : undefined}
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout" className="block text-sm font-medium text-muted-foreground">Check-out</label>
                    <Input 
                        type="date" id="checkout" 
                        value={checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setCheckOutDate(e.target.value ? new Date(e.target.value) : undefined)}
                        min={hasMounted && checkInDate ? format(addDays(checkInDate, 1), 'yyyy-MM-dd') : undefined}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-muted-foreground">Guests</label>
                  <Input 
                    type="number" id="guests" 
                    value={numberOfGuests} 
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value, 10) || 1)}
                    min="1" max={currentStay.maxGuests || 10} 
                  />
                </div>
                {totalPrice !== null && (
                  <div className="pt-2">
                    <p className="text-lg font-semibold">Total Price: <span className="text-primary">${totalPrice.toFixed(2)}</span></p>
                  </div>
                )}
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" 
                  onClick={handleBookNow}
                  disabled={!checkInDate || !checkOutDate || (checkOutDate <= checkInDate)}
                >
                  <CreditCard className="mr-2 h-5 w-5" /> Book Now
                </Button>
              </CardContent>
            </Card>

            <div className="hidden md:block">
             {currentStay.host && <HostInfo host={currentStay.host} onContact={handleContactHost} />}
            </div>
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
                        <p className="text-xs text-muted-foreground">{formattedReviewDates[review.id] || ''}</p>
                        <BadgeCheck className="h-3 w-3 text-green-500" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  </div>
                </CardHeader>
                <CardContent><p className="text-muted-foreground">{review.comment}</p></CardContent>
              </Card>
            )) : <p className="text-muted-foreground">No reviews yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface HostInfoProps { host: Host; onContact: () => void; }
function HostInfo({ host, onContact }: HostInfoProps) {
  return (
    <Card className="border bg-background shadow-md">
        <CardHeader className="text-center">
        <Image src={host.avatar} alt={host.name} width={80} height={80} className="rounded-full mx-auto mb-2" data-ai-hint={host.dataAiHint} />
        <CardTitle className="text-xl">Hosted by {host.name}</CardTitle>
        <CardDescription>Superhost (Demo)</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
        <Button variant="outline" className="w-full" onClick={onContact}>
            <MessageSquare className="mr-2 h-4 w-4" /> Contact Host
        </Button>
        </CardContent>
    </Card>
  );
}
