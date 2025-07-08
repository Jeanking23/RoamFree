// src/app/attractions/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Star, MapPin, Ticket, MessageSquare, Share2, Heart, AlertTriangle, Clock, Users, ExternalLink, Camera, Users2, Wifi, Moon, Sun, CloudSun, Calendar, Info, Landmark as LandmarkIcon, BadgeCheck, Percent, Ear, X, ThumbsUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { mockAttractionDetails, type MockAttraction } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function AttractionProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [attraction, setAttraction] = useState<MockAttraction | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState(attraction?.photos[0] || null);
  const [isArViewActive, setIsArViewActive] = useState(false);
  const [isAudioGuideActive, setIsAudioGuideActive] = useState(false);
  
  useEffect(() => {
    // In a real app, fetch data based on params.id
    // For now, we use mockAttractionDetails regardless of ID.
    if (params.id) {
       setAttraction(mockAttractionDetails);
       setCurrentImage(mockAttractionDetails.photos[0]);
    }
  }, [params.id]);


  const handleBookTickets = () => {
    toast({ title: "Book Tickets (Demo)", description: `Proceeding to ticket booking for ${attraction?.name}. QR code ticketing would be simulated here.` });
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


  if (!attraction) { 
    return <div className="text-center py-10">Loading attraction details...</div>; 
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
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer" onClick={() => setCurrentImage(attraction.photos[0])}>
              {currentImage && <Image src={currentImage.src} alt={currentImage.alt} fill className="object-cover rounded-l-md" data-ai-hint={currentImage.dataAiHint} />}
            </div>
            {attraction.photos.slice(1, 5).map((photo, index) => (
              <div key={photo.id} className={`relative aspect-[4/3] md:aspect-auto cursor-pointer ${index > 1 ? 'hidden md:block' : ''}`} onClick={() => setCurrentImage(photo)}>
                <Image src={photo.src} alt={photo.alt} fill className={`object-cover ${index === 1 ? "md:rounded-tr-md" : index === 3 ? "md:rounded-br-md" : ""}`} data-ai-hint={photo.dataAiHint} />
              </div>
            ))}
          </div>
           <div className="mt-2 flex gap-2 overflow-x-auto p-2 md:hidden">
             {attraction.photos.map(photo => (
                 <Image key={photo.id} src={photo.src} alt={photo.alt} width={80} height={60} className={`rounded object-cover cursor-pointer ${currentImage?.id === photo.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setCurrentImage(photo)} data-ai-hint={photo.dataAiHint}/>
             ))}
          </div>
           <div className="text-center mt-2 flex justify-center gap-2">
             <Button variant="outline" onClick={() => setIsArViewActive(true)}><Camera className="mr-2 h-4 w-4" /> Try AR Guide (Demo)</Button>
             <Button variant="outline" onClick={() => setIsAudioGuideActive(true)} className="ml-2"><Ear className="mr-2 h-4 w-4" /> Start Audio Guide (Demo)</Button>
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
              <h3 className="text-xl font-semibold mb-3">Visitor Photo Gallery (Demo)</h3>
              <div className="grid grid-cols-3 gap-2">
                 {attraction.visitorPhotos.map((photo, i) => (
                    <Image key={`gallery-${i}`} src={photo.src} alt={photo.alt} width={150} height={100} className="rounded-md object-cover" data-ai-hint={photo.dataAiHint}/>
                 ))}
              </div>
               <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => toast({title: "Liked!", description:"Thanks for your feedback."})}><ThumbsUp className="h-4 w-4 mr-1"/> Like Gallery</Button>
                <Button variant="link" size="sm" onClick={() => toast({title: "Upload Photos (Demo)", description:"Photo upload feature coming soon."})}>+ Add Your Photos</Button>
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
                 <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleBookTickets}>
                  <Ticket className="mr-2 h-5 w-5" /> Book Tickets (Demo)
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" /> Get Directions (Demo)
                </Button>
                 <p className="text-xs text-muted-foreground text-center">Ticket booking is a demo feature. QR codes for entry coming soon.</p>
              </CardContent>
            </Card>
             <Card className="shadow-md border">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><Percent className="h-5 w-5"/>Deals & Combos (Demo)</CardTitle>
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
                     <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {review.user.substring(0,1)}
                    </div>
                    <div>
                      <p className="font-semibold">{review.user}</p>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
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
                   <Button variant="link" size="sm" className="px-0 h-auto text-xs">Translate (Demo)</Button>
                </CardContent>
              </Card>
            ))}
             <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                     <p className="font-semibold">Top Tips from Travelers (Demo)</p>
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
                <span>Report this attraction if you find any issues. (Placeholder)</span>
            </div>
        </CardFooter>
      </Card>
    </div>

    {/* AR View Overlay */}
    <div className={cn("fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300", isArViewActive ? "opacity-100" : "opacity-0 pointer-events-none")}>
      <Card className="w-11/12 max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AR Guide (Demo)
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
                Audio Guide (Demo)
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
    </>
  );
}
