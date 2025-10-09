
// src/app/attractions/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Star, MapPin, Ticket, MessageSquare, Share2, Heart, AlertTriangle, Clock, Users, ExternalLink, Camera, Users2, Wifi, Moon, Sun, CloudSun, Calendar, Info, Landmark as LandmarkIcon, BadgeCheck, Percent, Ear, X, ThumbsUp, Plus, Minus, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { mockAttractionDetails, type MockAttraction } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

export default function AttractionProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [attraction, setAttraction] = useState<MockAttraction | null>(mockAttractionDetails);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState(attraction?.photos[0] || null);
  const [isArViewActive, setIsArViewActive] = useState(false);
  const [isAudioGuideActive, setIsAudioGuideActive] = useState(false);
  
  // State for booking dialog
  const [ticketCount, setTicketCount] = useState(1);
  const [visitDate, setVisitDate] = useState<string>('');
  
  // State for lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // State for formatted dates to prevent hydration errors
  const [reviewDates, setReviewDates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Set a default visit date for the booking dialog
    setVisitDate(format(new Date(), 'yyyy-MM-dd'));

    // Format review dates on the client side to avoid hydration mismatch
    if (attraction?.userReviews) {
        const formattedDates = attraction.userReviews.reduce((acc, review) => {
            acc[review.id] = new Date(review.date).toLocaleDateString();
            return acc;
        }, {} as { [key: string]: string });
        setReviewDates(formattedDates);
    }
  }, [attraction]);
  
  useEffect(() => {
    // In a real app, this would be the place to fetch data based on params.id if it wasn't pre-loaded
    // For this demo, we initialize the state directly with mock data for better performance.
    if (params.id && !attraction) {
       // Logic to handle if data wasn't found initially or needs re-fetching
       console.log("Looking for attraction with ID:", params.id);
    }
  }, [params.id, attraction]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };
  
  const displayPhotos = attraction?.photos || [];

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prevIndex) => (prevIndex + 1) % displayPhotos.length);
  }, [displayPhotos.length]);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prevIndex) => (prevIndex - 1 + displayPhotos.length) % displayPhotos.length);
  }, [displayPhotos.length]);

   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextLightboxImage, prevLightboxImage]);


  const handleBookTickets = () => {
    toast({ title: "Tickets Confirmed!", description: `Your ${ticketCount} ticket(s) for ${attraction?.name} on ${format(new Date(visitDate), 'PPP')} are confirmed. A QR code would be sent to your email.` });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: attraction?.name,
        text: `Check out this cool attraction: ${attraction?.name}`,
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
  
  const handleGetDirections = () => {
    if (attraction) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.location)}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleReportAttraction = () => {
    toast({
      title: "Report Submitted",
      description: `Thank you for your feedback. Our team will review the report for ${attraction?.name}.`,
    });
  };


  if (!attraction) { 
    return <div className="text-center py-10">Attraction not found.</div>; 
  }

  const getCrowdLevelIcon = (level: string) => {
    if (level === "Low") return <Users className="inline h-4 w-4 mr-1 text-green-500"/>;
    if (level === "Moderate") return <Users className="inline h-4 w-4 mr-1 text-yellow-500"/>;
    if (level === "High") return <Users2 className="inline h-4 w-4 mr-1 text-red-500"/>;
    return <Users className="inline h-4 w-4 mr-1 text-muted-foreground"/>;
  }
  
  const getLiveStatusColor = (status: string) => {
      if (status === "Open") return "text-green-600";
      if (status === "Closing Soon") return "text-orange-500";
      if (status === "Closed") return "text-red-500";
      return "text-muted-foreground";
  }

  return (
    <>
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{attraction.name}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-5 w-5" /> <span>{attraction.location}</span>
                <Separator orientation="vertical" className="h-5" />
                <Star className="h-5 w-5 text-yellow-400" /> <span>{attraction.rating} ({attraction.reviewsCount} reviews)</span>
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

        <CardContent className="px-0 md:px-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:max-h-[500px] overflow-hidden rounded-md">
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer group" onClick={() => openLightbox(0)}>
              {currentImage && <Image src={currentImage.src} alt={currentImage.alt} fill className="object-cover rounded-l-md" data-ai-hint={currentImage.dataAiHint} />}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize className="h-12 w-12 text-white" />
              </div>
            </div>
            {attraction.photos.slice(1, 5).map((photo, index) => (
              <div key={photo.id} className={`relative aspect-[4/3] md:aspect-auto cursor-pointer group ${index > 1 ? 'hidden md:block' : ''}`} onClick={() => openLightbox(index + 1)}>
                <Image src={photo.src} alt={photo.alt} fill className={`object-cover ${index === 1 ? "md:rounded-tr-md" : index === 3 ? "md:rounded-br-md" : ""}`} data-ai-hint={photo.dataAiHint} />
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize className="h-8 w-8 text-white" />
                 </div>
              </div>
            ))}
          </div>
           <div className="mt-2 flex gap-2 overflow-x-auto p-2 md:hidden">
             {attraction.photos.map((photo, index) => (
                 <Image key={photo.id} src={photo.src} alt={photo.alt} width={80} height={60} className={`rounded object-cover cursor-pointer ${currentImage?.id === photo.id ? 'ring-2 ring-primary' : ''}`} onClick={() => openLightbox(index)} data-ai-hint={photo.dataAiHint}/>
             ))}
          </div>
           <div className="text-center mt-2 flex justify-center gap-2">
             <Button variant="outline" onClick={() => setIsArViewActive(true)}>
                <span><Camera className="mr-2 h-4 w-4" /> Try AR Guide</span>
             </Button>
             <Button variant="outline" onClick={() => setIsAudioGuideActive(true)}>
              <span><Ear className="mr-2 h-4 w-4" /> Start Audio Guide</span>
            </Button>
           </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">About {attraction.name}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{attraction.description}</p>
            </div>
             <div>
              <h3 className="text-xl font-semibold mb-2">Details</h3>
               <p className={`text-sm font-bold ${getLiveStatusColor(attraction.liveStatus)}`}>Live Status: {attraction.liveStatus}</p>
              <p className="text-sm text-muted-foreground"><strong><Clock className="inline h-4 w-4 mr-1"/>Opening Hours:</strong> {attraction.openingHours}</p>
              <p className="text-sm text-muted-foreground"><strong><Ticket className="inline h-4 w-4 mr-1"/>Ticket Price:</strong> {attraction.ticketPrice}</p>
              <p className="text-sm text-muted-foreground"><strong>{getCrowdLevelIcon(attraction.expectedCrowdLevel)}Expected Crowd:</strong> {attraction.expectedCrowdLevel}</p>
              <p className="text-sm text-muted-foreground"><strong><MessageSquare className="inline h-4 w-4 mr-1"/>Contact:</strong> {attraction.contactInfo}</p>
              {attraction.website && 
                <p className="text-sm text-muted-foreground"><strong><ExternalLink className="inline h-4 w-4 mr-1"/>Website:</strong> <a href={attraction.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{attraction.website}</a></p>
              }
               {attraction.maintenanceNote && <p className="text-sm text-orange-500 mt-1"><strong><Info className="inline h-4 w-4 mr-1"/>Note:</strong> {attraction.maintenanceNote}</p>}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Amenities/Features</h3>
              <div className="flex flex-wrap gap-2">
                {attraction.amenities.map(amenity => (
                  <Badge key={amenity} variant="secondary">{amenity}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Visitor Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                 {attraction.visitorPhotos.map((photo, i) => (
                    <Image key={`gallery-${i}`} src={photo.src} alt={photo.alt} width={150} height={100} className="rounded-md object-cover" data-ai-hint={photo.dataAiHint}/>
                 ))}
              </div>
               <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => toast({title: "Liked!", description:"Thanks for your feedback."})}>
                  <span><ThumbsUp className="h-4 w-4 mr-1"/> Like Gallery</span>
                </Button>
                <Button variant="link" size="sm" onClick={() => toast({title: "Upload Photos", description:"This would open a file upload dialog."})}>+ Add Your Photos</Button>
               </div>
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">Plan Your Visit</CardTitle>
                <CardDescription>Book tickets and find directions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="accent" size="lg" className="w-full">
                            <span><Ticket className="mr-2 h-5 w-5" /> Book Tickets</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Book Tickets for {attraction.name}</DialogTitle>
                            <DialogDescription>Select number of tickets and visit date.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="ticket-count" className="text-lg">Tickets:</Label>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setTicketCount(p => Math.max(1, p-1))}><Minus className="h-4 w-4"/></Button>
                                    <Input id="ticket-count" type="number" value={ticketCount} readOnly className="w-16 text-center" />
                                    <Button variant="outline" size="icon" onClick={() => setTicketCount(p => p+1)}><Plus className="h-4 w-4"/></Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="visit-date">Visit Date:</Label>
                                <Input id="visit-date" type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} min={format(new Date(), 'yyyy-MM-dd')} />
                            </div>
                        </div>
                        <DialogFooter>
                           <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                           <DialogClose asChild><Button onClick={handleBookTickets}>Confirm Tickets</Button></DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button variant="outline" className="w-full" onClick={handleGetDirections}>
                  <span><MapPin className="mr-2 h-4 w-4" /> Get Directions</span>
                </Button>
              </CardContent>
            </Card>
             <Card className="shadow-md border">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><Percent className="h-5 w-5"/>Deals & Combos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attraction.deals.map(deal => (
                    <div key={deal.id} className="p-2 border-l-4 border-accent bg-accent/10 rounded-r-md">
                      <p className="font-semibold">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">{deal.description}</p>
                    </div>
                  ))}
                </CardContent>
            </Card>
          </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent>
          <h3 className="text-2xl font-semibold mb-4">Visitor Reviews ({attraction.reviewsCount})</h3>
          <div className="space-y-6">
            {attraction.userReviews.map(review => (
              <Card key={review.id} className="bg-muted/30">
                <CardHeader className="flex flex-row justify-between items-center pb-2">
                  <div className="flex items-center gap-2">
                     <Image src={review.avatar || `https://placehold.co/40x40.png?text=${review.user.substring(0,1)}`} alt={review.user} width={40} height={40} className="rounded-full" data-ai-hint={review.dataAiHintAvatar || "person avatar"} />
                    <div>
                      <p className="font-semibold">{review.user}</p>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground">{reviewDates[review.id] || ''}</p>
                        <BadgeCheck className="h-4 w-4 ml-1 text-green-500" title="Verified Review"/>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.comment}</p>
                   <Button variant="link" size="sm" className="px-0 h-auto text-xs" onClick={() => toast({title: "Translate", description: "Translation feature coming soon."})}>Translate</Button>
                </CardContent>
              </Card>
            ))}
             <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                     <p className="font-semibold">Top Tips from Travelers</p>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {attraction.topTips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </CardContent>
            </Card>
            <Button variant="outline">Show all {attraction.reviewsCount} reviews</Button>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-orange-500"/>
                <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground" onClick={handleReportAttraction}>
                    Report this attraction if you find any issues.
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>

    {/* AR View Overlay */}
    <div className={cn("fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300", isArViewActive ? "opacity-100" : "opacity-0 pointer-events-none")}>
      <Card className="w-11/12 max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AR Guide
            <Button variant="ghost" size="icon" onClick={() => setIsArViewActive(false)}><X className="h-5 w-5"/></Button>
          </CardTitle>
          <CardDescription>This is a simulation of the Augmented Reality guide.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Camera className="h-24 w-24 mx-auto text-muted-foreground mb-4"/>
            <p className="font-semibold">Point your camera at an exhibit</p>
            <p className="text-sm text-muted-foreground">Information will be overlaid on your screen.</p>
        </CardContent>
      </Card>
    </div>

    {/* Audio Guide Overlay */}
    <div className={cn("fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300", isAudioGuideActive ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <Card className="w-11/12 max-w-md">
         <CardHeader>
            <CardTitle className="flex items-center justify-between">
                Audio Guide
                <Button variant="ghost" size="icon" onClick={() => setIsAudioGuideActive(false)}><X className="h-5 w-5"/></Button>
            </CardTitle>
            <CardDescription>This is a simulation of the Audio guide.</CardDescription>
         </CardHeader>
         <CardContent className="text-center">
            <Ear className="h-24 w-24 mx-auto text-muted-foreground mb-4"/>
            <p className="font-semibold">Playing: Exhibit Hall A - The Renaissance</p>
            <p className="text-sm text-muted-foreground">Your guide will automatically continue as you move through the museum.</p>
        </CardContent>
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

          <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10" onClick={prevLightboxImage}>
            <ChevronLeft className="h-10 w-10" />
          </Button>

          <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white hover:bg-white/10" onClick={nextLightboxImage}>
            <ChevronRight className="h-10 w-10" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
