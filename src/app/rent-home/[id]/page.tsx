
// src/app/rent-home/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, DollarSign, MapPin, Bed, Bath, Smile, TvIcon, Layers, FileText, Phone, HomeIcon as HomeIconLucide, School, Building as BuildingIconLucide, Leaf, CheckCircle, Info, AlertTriangle, MessageSquare, Heart, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { findRentalPropertyById, type MockStay } from '@/lib/mock-data';
import Link from 'next/link';

export default function RentalPropertyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<MockStay | null | undefined>(undefined);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState<{ src: string; alt: string; dataAiHint: string } | null>(null);

  useEffect(() => {
    if (params.id) {
      const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundProperty = findRentalPropertyById(propertyId);
      if (foundProperty) {
        setProperty(foundProperty);
        setCurrentImage(foundProperty.photos && foundProperty.photos.length > 0 ? foundProperty.photos[0] : { id: 'main', src: foundProperty.image, alt: foundProperty.name, dataAiHint: foundProperty.dataAiHint });
      } else {
        setProperty(null); // Not found
      }
    }
  }, [params.id]);

  const handleScheduleTour = () => {
    if (!property) return;
    toast({ title: "Tour Scheduled (Demo)", description: `A tour for ${property.name} has been requested.` });
  };

  const handleApplyNow = () => {
    if (!property) return;
    toast({ title: "Application Started (Demo)", description: `Proceeding to application for ${property.name}. Secure document upload and e-signature would be here.` });
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
  
  const displayPhotos = property.photos && property.photos.length > 0 ? property.photos : [{id: 'main', src: property.image, alt: property.name, dataAiHint: property.dataAiHint}];


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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HomeIconLucide className="h-5 w-5"/> Neighborhood Insights (Demo)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Walkability Score:</strong> {property.walkabilityScore || 'N/A'}/100</p>
                <p className="flex items-center gap-1"><School className="h-4 w-4"/><strong>Nearby Schools:</strong> {property.nearbySchools || 'N/A'}</p>
                <p className="flex items-center gap-1"><BuildingIconLucide className="h-4 w-4"/><strong>Public Transport:</strong> Available (Details coming soon)</p>
              </CardContent>
            </Card>
            
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
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleApplyNow}>
                  <FileText className="mr-2 h-5 w-5" /> Apply Now (Demo)
                </Button>
                <Button variant="outline" className="w-full" onClick={handleScheduleTour}>
                  <CalendarDays className="mr-2 h-4 w-4" /> Schedule In-Person Tour (Demo)
                </Button>
                 <p className="text-xs text-muted-foreground text-center">Tenant screening (ID, income) may be required by host (Demo).</p>
                 <p className="text-xs text-muted-foreground text-center">Digital Lease Signing & Secure Payments via RoamFree Wallet (Demo).</p>
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
