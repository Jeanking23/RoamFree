
// src/app/car-rent/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Gauge, DollarSign, MapPin, CheckCircle, TvIcon, Settings, FileText, User, Share2, Heart, AlertTriangle, Users, Car as CarIcon, Star, KeyRound, ShieldCheck, ChevronLeft, ChevronRight, Unlock, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { carListings, type CarListing } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CarRentalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;
  const car = carListings.find(c => c.id.toString() === carId);

  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDamageDialogOpen, setIsDamageDialogOpen] = useState(false);
  const [is360DialogOpen, setIs360DialogOpen] = useState(false);
  const [rentalDuration, setRentalDuration] = useState("daily");

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
      setIs360DialogOpen(true);
  };
  
  const handleConfirmRental = () => {
    if (!car) return;
    toast({
      title: "Rental Confirmed! (Demo)",
      description: `Your rental for ${car.name} is confirmed. Driver's license upload and payment would be the next steps.`,
    });
  };

  const handleDamageReportSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const damageDetails = formData.get('damageDetails');
    toast({
        title: "Damage Report Submitted (Demo)",
        description: `Thank you for reporting. Your notes: "${damageDetails}". This has been logged for car: ${car?.name}`
    });
    setIsDamageDialogOpen(false);
  }

  const handleDigitalKey = () => {
    toast({ title: "Digital Key Activated (Demo)", description: "Your phone is now the key. Tap to unlock."});
  }

  const handleRemoteUnlock = () => {
    toast({ title: "Car Unlocked (Demo)", description: `${car?.name} has been remotely unlocked.`});
  }


  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Car Not Found</h1>
        <p className="text-muted-foreground mb-4">The car you are looking for is not available or does not exist.</p>
        <Button onClick={() => router.push('/car-rent')}>Back to Car Rentals</Button>
      </div>
    );
  }
  
  const currentImage = car.photos[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + car.photos.length) % car.photos.length);
  };


  return (
    <>
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
          {/* Sliding Image Gallery */}
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              {currentImage && (
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out"
                  data-ai-hint={currentImage.dataAiHint}
                />
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-background/50 hover:bg-background/80"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-background/50 hover:bg-background/80"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next image</span>
            </Button>
          </div>
          <div className="mt-4 flex justify-center gap-2 overflow-x-auto p-2">
            {car.photos.map((photo, index) => (
              <Image
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                width={80}
                height={60}
                className={`rounded object-cover cursor-pointer transition-all ${currentImageIndex === index ? 'ring-2 ring-primary scale-105' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setCurrentImageIndex(index)}
                data-ai-hint={photo.dataAiHint}
              />
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={handle360View}><TvIcon className="mr-2 h-4 w-4" /> View 360° Interior</Button>
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
                  <Select value={rentalDuration} onValueChange={setRentalDuration}>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="accent" size="lg" className="w-full">
                      <CalendarDays className="mr-2 h-5 w-5" /> Reserve Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Your Reservation</DialogTitle>
                      <DialogDescription>
                        Review the details of your rental for the {car.name}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                      <p><strong>Vehicle:</strong> {car.name}</p>
                      <p><strong>Duration:</strong> <span className="capitalize">{rentalDuration}</span></p>
                      <p className="text-lg font-semibold">This is a demo. No payment will be processed.</p>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleConfirmRental}>Confirm Reservation</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full" onClick={handleConfirmRental}>Rent Now</Button>
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
        
        <CardFooter className="border-t pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
                <Button variant="destructive" size="sm" onClick={() => setIsDamageDialogOpen(true)}>
                    <AlertTriangle className="mr-2 h-4 w-4"/> Report Listing or Damage
                </Button>
                <p className="text-xs text-muted-foreground">Use this to report listing inaccuracies or pre/post-trip damage.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDigitalKey}><KeyRound className="mr-2 h-4 w-4"/>Digital Key (Demo)</Button>
                <Button variant="outline" size="sm" onClick={handleRemoteUnlock}><Unlock className="mr-2 h-4 w-4"/>Remote Unlock (Demo)</Button>
            </div>
        </CardFooter>
      </Card>
    </div>

    {/* Report Damage Dialog */}
    <Dialog open={isDamageDialogOpen} onOpenChange={setIsDamageDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/>Report an Issue</DialogTitle>
                <DialogDescription>Please describe the issue with the listing or vehicle. This helps us maintain a safe platform.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDamageReportSubmit}>
              <div className="py-4 space-y-4">
                  <div>
                      <Label htmlFor="damage-type">Issue Type (Demo)</Label>
                      <Select defaultValue="exterior">
                          <SelectTrigger id="damage-type"><SelectValue/></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="listing_inaccuracy">Listing Inaccuracy</SelectItem>
                              <SelectItem value="pre_trip_damage">Pre-Trip Damage</SelectItem>
                              <SelectItem value="post_trip_damage">Post-Trip Damage</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label htmlFor="damageDetails">Description of Issue</Label>
                      <Textarea id="damageDetails" name="damageDetails" placeholder="e.g., Small scratch on the front passenger door." required />
                  </div>
                  <div>
                      <Label htmlFor="damage-photo">Upload Photo (Demo)</Label>
                      <Input id="damage-photo" type="file" accept="image/*" />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit">Submit Report</Button>
              </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
    
    {/* 360 View Dialog */}
      <Dialog open={is360DialogOpen} onOpenChange={setIs360DialogOpen}>
          <DialogContent className="max-w-3xl">
              <DialogHeader>
                  <DialogTitle>360° Interior View: {car?.name}</DialogTitle>
                  <DialogDescription>This is a simulation of the 360° vehicle interior view.</DialogDescription>
              </DialogHeader>
              <div className="py-4 text-center">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center border">
                      <Image src="https://placehold.co/800x450.png" alt="360 view placeholder" width={800} height={450} className="w-full h-full object-cover" data-ai-hint="car interior wide"/>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Drag to explore the vehicle's interior.</p>
              </div>
          </DialogContent>
      </Dialog>
    </>
  );
}
