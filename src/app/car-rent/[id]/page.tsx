// src/app/car-rent/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Gauge, DollarSign, MapPin, CheckCircle, TvIcon, Settings, FileText, User, Share2, Heart, AlertTriangle, Users, Car as CarIcon, Star, KeyRound } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { carListings } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function CarRentalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;
  const car = carListings.find(c => c.id.toString() === carId);

  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState(car?.photos[0] || null);

  useEffect(() => {
    if (car && !currentImage) {
      setCurrentImage(car.photos[0]);
    }
  }, [car, currentImage]);

  const handleShare = () => {
    if (!car) return;
    if (navigator.share) {
      navigator.share({
        title: car.name,
        text: `Check out this car for rent: ${car.name}`,
        url: window.location.href,
      }).then(() => toast({ title: "Shared successfully!" }))
        .catch(error => console.error('Error sharing:', error));
    } else {
      toast({ title: "Share", description: "Web Share API not supported. You can copy the URL." });
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({ title: isFavorited ? "Removed from Wishlist" : "Added to Wishlist" });
  };
  
  const handle360View = () => {
      toast({ title: `360° View (Demo) - ${car?.name}`, description: "Showing immersive 360° view of the vehicle." });
  };
  
  const handleRentNow = () => {
    if (!car) return;
    toast({
      title: "Rental Initiated (Demo)",
      description: `You've started the rental process for ${car.name}. Driver's license upload would be required here.`,
    });
  };

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Car Not Found</h1>
        <p className="text-muted-foreground mb-4">The car you are looking for is not available or does not exist.</p>
        <Button onClick={() => router.push('/car-rent')}>Back to Car Rentals</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{car.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground mt-1">
                <span className="flex items-center"><CarIcon className="h-5 w-5 mr-1" /> {car.type}</span>
                <Separator orientation="vertical" className="h-5 hidden sm:block" />
                <span className="flex items-center"><CalendarDays className="h-5 w-5 mr-1" /> {car.year}</span>
                <Separator orientation="vertical" className="h-5 hidden sm:block" />
                <span className="flex items-center"><Star className="h-5 w-5 mr-1 text-yellow-400" /> {car.rating} ({car.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0 self-start">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleToggleFavorite} aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}>
                      <Heart className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>{isFavorited ? "Remove from wishlist" : "Add to wishlist"}</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                      <Share2 className="h-6 w-6 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Share</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 md:px-6 pt-0">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:max-h-[500px] overflow-hidden rounded-md">
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto">
              {currentImage && <Image src={currentImage.src} alt={currentImage.alt} layout="fill" objectFit="cover" className="rounded-l-md" data-ai-hint={currentImage.dataAiHint} />}
            </div>
            {car.photos.slice(1, 5).map((photo, index) => (
              <div key={photo.id} className={`relative aspect-[4/3] md:aspect-auto cursor-pointer ${index > 1 ? 'hidden md:block' : ''}`} onClick={() => setCurrentImage(photo)}>
                <Image src={photo.src} alt={photo.alt} layout="fill" objectFit="cover" className={index === 1 ? "md:rounded-tr-md" : index === 3 ? "md:rounded-br-md" : ""} data-ai-hint={photo.dataAiHint} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto p-2 md:hidden">
            {car.photos.map(photo => (
              <Image key={photo.id} src={photo.src} alt={photo.alt} width={80} height={60} className={`rounded object-cover cursor-pointer ${currentImage?.id === photo.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setCurrentImage(photo)} data-ai-hint={photo.dataAiHint} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={handle360View}><TvIcon className="mr-2 h-4 w-4" /> View 360° Interior (Demo)</Button>
          </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Vehicle Overview</h3>
              <p className="text-muted-foreground whitespace-pre-line mb-4">{car.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <p><strong><Gauge className="inline h-4 w-4 mr-1"/>Mileage:</strong> {car.mileage}</p>
                <p><strong><Settings className="inline h-4 w-4 mr-1"/>Transmission:</strong> {car.transmission}</p>
                <p><strong><Users className="inline h-4 w-4 mr-1"/>Seats:</strong> {car.seats}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground">
                {car.features.map(feature => (
                  <li key={feature} className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {feature}</li>
                ))}
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/>Policies & Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong><ShieldCheck className={`inline h-4 w-4 mr-1 ${car.insuranceIncluded ? 'text-green-600' : 'text-orange-500'}`} />Insurance:</strong> {car.insuranceIncluded ? "Basic coverage included" : "Required, available as add-on"}</p>
                <p><strong><KeyRound className="inline h-4 w-4 mr-1 text-primary"/>Fuel Policy:</strong> {car.fuelPolicy}</p>
                <p><strong><User className="inline h-4 w-4 mr-1 text-primary"/>License:</strong> {car.licenseRequired}</p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">${car.pricePerDay}<span className="text-base font-normal text-muted-foreground">/day</span></CardTitle>
                <CardDescription>Select rental duration to see total price.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="rental-duration-details">Rental Duration</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="rental-duration-details">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly (${car.pricePerHour}/hr)</SelectItem>
                      <SelectItem value="daily">Daily (${car.pricePerDay}/day)</SelectItem>
                      <SelectItem value="weekly">Weekly (${car.pricePerWeek}/wk)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">Short-term & Long-term rental discounts available.</p>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleRentNow}>
                  <CalendarDays className="mr-2 h-5 w-5" /> Reserve Now (Demo)
                </Button>
                <p className="text-xs text-muted-foreground text-center">You won't be charged yet. This is a demo.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><MapPin className="h-5 w-5"/>Pickup Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                   {car.pickupLocations.map(loc => <Badge key={loc} variant="outline">{loc}</Badge>)}
                </div>
                 <p className="text-xs text-muted-foreground mt-2">One-way rentals & custom delivery options available (Demo).</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-orange-500"/>
                <span>Report this listing or pre/post-trip damage. (Placeholder)</span>
            </div>
             <p className="text-xs text-muted-foreground">Digital key and remote unlock features coming soon.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
