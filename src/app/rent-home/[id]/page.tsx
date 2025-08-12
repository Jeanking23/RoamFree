
// src/app/rent-home/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, DollarSign, MapPin, Bed, Bath, Smile, TvIcon, Layers, FileText, Phone, HomeIcon as HomeIconLucide, School, Building as BuildingIconLucide, Leaf, CheckCircle, Info, AlertTriangle, MessageSquare, Heart, Share2, Wallet, UserCheck, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { findRentalPropertyById, type MockStay } from '@/lib/mock-data';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';


export default function RentalPropertyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<MockStay | null | undefined>(undefined);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [tourDate, setTourDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');


  useEffect(() => {
    if (params.id) {
      const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundProperty = findRentalPropertyById(propertyId);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        setProperty(null); // Not found
      }
    }
  }, [params.id]);

  const displayPhotos = property?.photos && property.photos.length > 0 ? property.photos : property ? [{id: 'main', src: property.image, alt: property.name, dataAiHint: property.dataAiHint}] : [];
  const currentImage = displayPhotos[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % displayPhotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + displayPhotos.length) % displayPhotos.length);
  };

  
  const handleScheduleTour = () => {
    if (!property || !tourDate || !selectedTime) {
      toast({ title: "Please select a date and time for the tour.", variant: "destructive" });
      return;
    }
    toast({ title: "Tour Scheduled! (Demo)", description: `Your tour for ${property.name} is confirmed for ${tourDate.toLocaleDateString()} at ${selectedTime}. You'll receive a confirmation email.` });
  };

  const handleApplyNow = () => {
    if (!property) return;
    toast({ title: "Application Submitted! (Demo)", description: `Your application for ${property.name} has been submitted for review.` });
  };
  
  const handleContactAgent = () => {
    if (!property) return;
    toast({ title: "Contacting Agent/Owner (Demo)", description: `Opening chat with agent/owner for ${property.name}.` });
  };
  
  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({ title: isFavorited ? "Removed from Wishlist" : "Added to Wishlist" });
  };

  const handleShare = () => {
    if (!property) return;
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: `Check out this rental: ${property.name}`,
        url: window.location.href,
      }).then(() => toast({ title: "Shared successfully!"}))
        .catch(error => console.error('Error sharing:', error));
    } else {
      toast({ title: "Share", description: "Web Share API not supported. You can copy the URL."});
    }
  };

  if (property === undefined) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading property details...</div>;
  }
  if (property === null) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Rental Property Not Found</h1>
        <p className="text-muted-foreground mb-4">The property you are looking for does not exist or may have been removed.</p>
        <Button onClick={() => router.push('/rent-home')}>Back to Rentals</Button>
      </div>
    );
  }
  

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{property.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground mt-1">
                <span className="flex items-center"><MapPin className="h-5 w-5 mr-1" /> {property.location}</span>
                <Separator orientation="vertical" className="h-5 hidden sm:block" />
                <span className="flex items-center"><DollarSign className="h-5 w-5 text-green-600 mr-1" /> {(property.price ?? property.pricePerNight).toLocaleString()}{property.price ? '/month' : '/night'}</span>
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
          {/* Image Gallery */}
          <div className="relative w-full max-w-4xl mx-auto">
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
             {displayPhotos.length > 1 && (
              <>
                <Button variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-background/50 hover:bg-background/80" onClick={prevImage}>
                  <ChevronLeft className="h-5 w-5" /><span className="sr-only">Previous image</span>
                </Button>
                <Button variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-background/50 hover:bg-background/80" onClick={nextImage}>
                  <ChevronRight className="h-5 w-5" /><span className="sr-only">Next image</span>
                </Button>
              </>
            )}
          </div>
          {displayPhotos.length > 1 && (
            <div className="mt-4 flex justify-center gap-2 overflow-x-auto p-2">
              {displayPhotos.map((photo, index) => (
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
          )}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
             <Button variant="outline" onClick={() => toast({title: "Virtual Tour (Demo)", description:`Starting virtual tour for ${property.name}`})} disabled={!property.virtualTourLink}><TvIcon className="mr-2 h-4 w-4" /> Virtual Tour</Button>
             <Button variant="outline" onClick={() => toast({title: "Floor Plan (Demo)", description:`Showing floor plan for ${property.name}`})} disabled={!property.floorPlanLink}><Layers className="mr-2 h-4 w-4" /> Interactive Floor Plan</Button>
          </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">About this Property</h3>
              <p className="text-muted-foreground whitespace-pre-line">{property.description || "No description available."}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <p><strong>Type:</strong> {property.category}</p>
                <p><strong>Bedrooms:</strong> {property.bedrooms ?? 'N/A'}</p>
                <p><strong>Bathrooms:</strong> {property.bathrooms ?? 'N/A'}</p>
                <p><strong>Size:</strong> {property.sizeSqft ? `${property.sizeSqft} sqft` : 'N/A'}</p>
            </div>
            {property.amenities && property.amenities.length > 0 && (
                <div>
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground">
                    {(Array.isArray(property.amenities) ? property.amenities : property.amenities.split(',')).map((amenity: string) => (
                    <li key={amenity.trim()} className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {amenity.trim()}</li>
                    ))}
                </ul>
                </div>
            )}
             {property.isEcoFriendly && <p className="text-green-600 flex items-center mt-2"><Leaf className="mr-2 h-4 w-4"/>This is an Eco-Friendly Property.</p>}

            {property.neighborhoodInsights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><HomeIconLucide className="h-5 w-5"/> Neighborhood Insights (Demo)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{property.neighborhoodInsights.description}</p>
                  <Separator/>
                  <p><strong>Walkability Score:</strong> {property.neighborhoodInsights.walkabilityScore}/100</p>
                  <p><strong>Crime Rate:</strong> {property.neighborhoodInsights.crimeRate}</p>
                  <div>
                    <h4 className="font-medium">Nearby Schools:</h4>
                    <ul className="list-disc list-inside ml-4">
                      {property.neighborhoodInsights.schools.map((school, i) => <li key={i}>{school.name} ({school.type}) - Rating: {school.rating}</li>)}
                    </ul>
                  </div>
                   <div>
                    <h4 className="font-medium">Public Transport:</h4>
                    <ul className="list-disc list-inside ml-4">
                      {property.neighborhoodInsights.publicTransport.map((pt, i) => <li key={i}>{pt.type} ({pt.line}) - Stop: {pt.stopDistance}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {property.host && (
              <Card className="md:hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Landlord/Agent</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                   <Image src={property.host.avatar} alt={property.host.name} width={60} height={60} className="rounded-full" data-ai-hint={property.host.dataAiHint} />
                   <div>
                     <p className="font-semibold">{property.host.name}</p>
                     <Button variant="outline" size="sm" className="mt-1" onClick={handleContactAgent}><MessageSquare className="mr-2 h-4 w-4"/>Message</Button>
                   </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">${(property.price ?? property.pricePerNight).toLocaleString()}<span className="text-base font-normal text-muted-foreground">{property.price ? '/month' : '/night'}</span></CardTitle>
                <CardDescription>Review details and proceed with your application or tour request.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3">
                            <FileText className="mr-2 h-5 w-5" /> Apply Now (Demo)
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Apply for {property.name}</DialogTitle>
                            <DialogDescription>Submit your application. This is a simulation.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="appName">Full Name</Label>
                                <Input id="appName" placeholder="John Doe"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="appEmail">Email</Label>
                                <Input id="appEmail" type="email" placeholder="john.doe@example.com"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="appMessage">Message to Host (Optional)</Label>
                                <Textarea id="appMessage" placeholder="Tell the host a bit about yourself."/>
                            </div>
                            <Button variant="outline" size="sm"><UserCheck className="mr-2 h-4 w-4"/>Run Tenant Screening (Demo)</Button>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <DialogClose asChild><Button onClick={handleApplyNow}>Submit Application</Button></DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline" className="w-full">
                            <CalendarDays className="mr-2 h-4 w-4" /> Schedule In-Person Tour (Demo)
                        </Button>
                    </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Schedule a Tour</DialogTitle>
                            <DialogDescription>Select a date and time to view the property.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col md:flex-row gap-4 py-4">
                            <Calendar mode="single" selected={tourDate} onSelect={setTourDate} className="rounded-md border"/>
                            <div className="space-y-2">
                                <h4 className="font-semibold">Available Times:</h4>
                                {['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map(time => (
                                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} className="w-full" onClick={() => setSelectedTime(time)}>{time}</Button>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                             <DialogClose asChild>
                                <Button onClick={handleScheduleTour}>Confirm Tour</Button>
                             </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                 <Separator className="my-2"/>
                 <p className="text-xs text-muted-foreground text-center flex items-center gap-2 justify-center"><Wallet className="h-4 w-4"/>Secure Payments via RoamFree Wallet</p>
                 <p className="text-xs text-muted-foreground text-center flex items-center gap-2 justify-center"><FileText className="h-4 w-4"/>Digital Lease Signing Available</p>
              </CardContent>
            </Card>
            {property.host && (
              <Card className="hidden md:block">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Landlord/Agent</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                   <Image src={property.host.avatar} alt={property.host.name} width={60} height={60} className="rounded-full" data-ai-hint={property.host.dataAiHint} />
                   <div>
                     <p className="font-semibold">{property.host.name}</p>
                     <Button variant="outline" size="sm" className="mt-1" onClick={handleContactAgent}><MessageSquare className="mr-2 h-4 w-4"/>Message</Button>
                   </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-orange-500"/>
                <span>Report this listing if you find any issues. (Placeholder)</span>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
