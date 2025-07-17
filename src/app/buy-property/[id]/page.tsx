
// src/app/buy-property/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, DollarSign, MapPin, Maximize, Layers, Home, Info, FileText, Star, TvIcon, Plane, Contact, ShieldCheck, MessageSquare, Video, Handshake, TrendingUp, Library, AlertTriangle, Heart, Share2, Calculator, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { findSalePropertyById, type MockStay } from '@/lib/mock-data'; // Import specific finder
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';


export default function SalePropertyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<MockStay | null | undefined>(undefined);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState<{ id: string; src: string; alt: string; dataAiHint: string } | null>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);


  useEffect(() => {
    if (params.id) {
      const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundProperty = findSalePropertyById(propertyId);
      if (foundProperty) {
        setProperty(foundProperty);
        setCurrentImage(foundProperty.photos && foundProperty.photos.length > 0 ? foundProperty.photos[0] : { id: 'main', src: foundProperty.image, alt: foundProperty.name, dataAiHint: foundProperty.dataAiHint });
      } else {
        setProperty(null); // Not found
      }
    }
  }, [params.id]);

  const displayPhotos = property?.photos && property.photos.length > 0 ? property.photos : property ? [{id: 'main', src: property.image, alt: property.name, dataAiHint: property.dataAiHint}] : [];


  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setLightboxIndex((prevIndex) => (prevIndex + 1) % displayPhotos.length);
  }, [displayPhotos.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prevIndex) => (prevIndex - 1 + displayPhotos.length) % displayPhotos.length);
  }, [displayPhotos.length]);


   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);


  const handleMakeOffer = () => {
    if (!property) return;
    toast({ title: "Make Offer (Demo)", description: `Initiating offer process for ${property.name}. Negotiation & secure escrow payment features would be here.` });
  };
  
  const handleScheduleTour = () => {
    if (!property) return;
    toast({ title: "Tour Scheduled (Demo)", description: `A tour for ${property.name} has been requested.` });
  };

  const handleContactAgent = () => {
    if (!property?.host) return;
    toast({ title: "Contacting Agent (Demo)", description: `Opening chat with agent ${property.host.name}.` });
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
        text: `Check out this property for sale: ${property.name}`,
        url: window.location.href,
      }).then(() => toast({ title: "Shared successfully!"}))
        .catch(error => console.error('Error sharing:', error));
    } else {
      toast({ title: "Share", description: "Web Share API not supported. You can copy the URL."});
    }
  };
  
  const handleMediaTool = (toolName: string, propertyName?: string) => {
    if (!propertyName) return;
    toast({ title: `${toolName} (Demo)`, description: `Showing ${toolName.toLowerCase()} for ${propertyName}.` });
  };


  if (property === undefined) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading property details...</div>;
  }
  if (property === null) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Property Not Found</h1>
        <p className="text-muted-foreground mb-4">The property you are looking for does not exist or may have been removed.</p>
        <Button onClick={() => router.push('/buy-property')}>Back to Listings</Button>
      </div>
    );
  }
  

  return (
    <>
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{property.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground mt-1">
                <span className="flex items-center"><MapPin className="h-5 w-5 mr-1" /> {property.location}</span>
                <Separator orientation="vertical" className="h-5 hidden sm:block" />
                <span className="flex items-center"><DollarSign className="h-5 w-5 text-green-600 mr-1" /> {(property.price ?? 0).toLocaleString()}</span>
                <Separator orientation="vertical" className="h-5 hidden sm:block" />
                <span className="flex items-center"><Home className="h-5 w-5 mr-1" /> {property.propertyType}</span>
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
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer group" onClick={() => openLightbox(0)}>
              {currentImage && <Image src={currentImage.src} alt={currentImage.alt} fill className="object-cover rounded-l-md" data-ai-hint={currentImage.dataAiHint} />}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize className="h-12 w-12 text-white" />
              </div>
            </div>
            {displayPhotos.slice(1, 5).map((photo, index) => (
              <div key={photo.id} className={`relative aspect-[4/3] md:aspect-auto cursor-pointer group ${index > 1 ? 'hidden md:block' : ''}`} onClick={() => openLightbox(index + 1)}>
                <Image src={photo.src} alt={photo.alt} fill className={`object-cover ${index === 1 ? "md:rounded-tr-md" : index === 3 ? "md:rounded-br-md" : ""}`} data-ai-hint={photo.dataAiHint} />
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize className="h-8 w-8 text-white" />
                 </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto p-2 md:hidden">
             {displayPhotos.map((photo, index) => (
                 <Image key={photo.id} src={photo.src} alt={photo.alt} width={80} height={60} className={`rounded object-cover cursor-pointer ${currentImage?.id === photo.id ? 'ring-2 ring-primary' : ''}`} onClick={() => openLightbox(index)} data-ai-hint={photo.dataAiHint}/>
             ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
             <Button variant="outline" onClick={() => handleMediaTool("Virtual Walkthrough", property.name)}><TvIcon className="mr-2 h-4 w-4" /> Virtual Walkthrough</Button>
             <Button variant="outline" onClick={() => handleMediaTool("Drone View", property.name)}><Plane className="mr-2 h-4 w-4" /> Drone View</Button>
             <Button variant="outline" onClick={() => handleMediaTool("3D Floor Plan", property.name)}><Contact className="mr-2 h-4 w-4" /> 3D Floor Plan</Button>
             {property.propertyType === "Land" && <Button variant="outline" onClick={() => handleMediaTool("Plot Map View", property.name)}><MapPin className="mr-2 h-4 w-4"/>Plot Map View</Button>}
          </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Property Overview</h3>
              <p className="text-muted-foreground whitespace-pre-line">{property.description || "No description available."}</p>
            </div>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <p><strong>Size:</strong> {property.sizeSqft || property.sizeAcres || 'N/A'}</p>
                <p><strong>Zoning:</strong> {property.zoning || 'N/A'}</p>
                <p><strong>Status:</strong> {property.status || 'N/A'}</p>
                {property.bedrooms && <p><strong>Bedrooms:</strong> {property.bedrooms}</p>}
                {property.bathrooms && <p><strong>Bathrooms:</strong> {property.bathrooms}</p>}
            </div>
            {property.amenities && property.amenities.length > 0 && (
                <div>
                <h3 className="text-xl font-semibold mb-3">Key Features/Amenities</h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground">
                    {(Array.isArray(property.amenities) ? property.amenities : property.amenities.split(',')).map((amenity:string) => (
                    <li key={amenity.trim()} className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-green-500" /> {amenity.trim()}</li>
                    ))}
                </ul>
                </div>
            )}
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5"/>Market Insights (Demo)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Last Sale Price:</strong> ${property.lastSalePrice?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Market Trend:</strong> {property.marketTrend || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Historical data and neighborhood comps coming soon.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/>Legal & Documents (Demo)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>Title Deed:</strong> <Button variant="link" size="sm" className="px-0 h-auto">View Document (Uploaded)</Button></p>
                    <p><strong>Zoning Certificate:</strong> <Button variant="link" size="sm" className="px-0 h-auto">View Document (Uploaded)</Button></p>
                    <p className="text-xs text-muted-foreground">Blockchain-based verification for ownership (Future Feature).</p>
                </CardContent>
            </Card>

             {property.host && (
              <Card className="md:hidden">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Agent</CardTitle>
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
                <CardTitle className="text-2xl">${(property.price ?? 0).toLocaleString()}</CardTitle>
                <CardDescription>Contact agent to make an offer or schedule a viewing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="accent" size="lg" className="w-full" onClick={handleMakeOffer}>
                  <DollarSign className="mr-2 h-5 w-5" /> Make an Offer
                </Button>
                <Button variant="outline" className="w-full" onClick={handleScheduleTour}>
                  <CalendarDays className="mr-2 h-4 w-4" /> Schedule Viewing
                </Button>
                <Button variant="outline" className="w-full" onClick={() => toast({title: "Video Call Agent (Demo)", description: "Initiating virtual consultation with agent."})}>
                  <Video className="mr-2 h-4 w-4" /> Video Call Agent
                </Button>
                 <p className="text-xs text-muted-foreground text-center">Secure Escrow Payment Available (Demo)</p>
              </CardContent>
            </Card>
            {property.host && (
              <Card className="hidden md:block">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Agent</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                   <Image src={property.host.avatar} alt={property.host.name} width={60} height={60} className="rounded-full" data-ai-hint={property.host.dataAiHint} />
                   <div>
                     <p className="font-semibold">{property.host.name}</p>
                     <p className="text-xs text-muted-foreground">Rating: {property.rating}/5 (Demo)</p>
                     <Button variant="outline" size="sm" className="mt-1" onClick={handleContactAgent}><MessageSquare className="mr-2 h-4 w-4"/>Message</Button>
                   </div>
                </CardContent>
              </Card>
            )}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5"/>Mortgage Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Estimate payments for this property.</p>
                    <Button variant="link" asChild className="px-0"><Link href="/buy-property#mortgage-calculator">Go to Calculator</Link></Button>
                </CardContent>
            </Card>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-orange-500"/>
                <span>Report this listing if you find any issues. (Placeholder)</span>
            </div>
             <p className="text-xs text-muted-foreground">RoamFree facilitates connections. Always perform due diligence.</p>
        </CardFooter>
      </Card>
    </div>
    
    <AnimatePresence>
      {isLightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative w-full h-full max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
          >
            <Image
              src={displayPhotos[lightboxIndex].src}
              alt={displayPhotos[lightboxIndex].alt}
              fill
              className="object-contain"
            />
          </motion.div>

          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/10" onClick={closeLightbox}>
            <X className="h-8 w-8" />
          </Button>

          <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10" onClick={prevImage}>
            <ChevronLeft className="h-10 w-10" />
          </Button>

          <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10" onClick={nextImage}>
            <ChevronRight className="h-10 w-10" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>

    </>
  );
}
