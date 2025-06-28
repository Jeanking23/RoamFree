// src/app/attractions/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Star, MapPin, Ticket, MessageSquare, Share2, Heart, AlertTriangle, Clock, Users, ExternalLink, Camera, Users2, Wifi, Moon, Sun } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data - in a real app, you'd fetch this based on params.id
const mockAttractionDetails = {
  id: "attr1",
  name: "City Museum of Art",
  category: "Culture",
  location: "123 Art Avenue, Downtown Cityville",
  rating: 4.7,
  reviewsCount: 320,
  description: "Explore a vast collection of modern and classical art spanning centuries. The City Museum of Art offers engaging exhibits, workshops, and guided tours. A must-visit for art enthusiasts and curious minds alike.",
  openingHours: "Tue-Sun: 10:00 AM - 6:00 PM (Closed Mondays)",
  ticketPrice: "$25 (Adults), $15 (Students/Seniors), Free (Children under 12)",
  amenities: ["Cafe", "Gift Shop", "Wheelchair Accessible", "Guided Tours"],
  photos: [
    { id: "p1", src: "https://placehold.co/800x600.png?text=Museum+Exhibit+1", alt: "Museum main exhibit hall", dataAiHint: "museum exhibit" },
    { id: "p2", src: "https://placehold.co/400x300.png?text=Sculpture+Garden", alt: "Museum sculpture garden", dataAiHint: "sculpture garden" },
    { id: "p3", src: "https://placehold.co/400x300.png?text=Museum+Facade", alt: "Museum exterior facade", dataAiHint: "museum building" },
    { id: "p4", src: "https://placehold.co/400x300.png?text=Interactive+Display", alt: "Interactive display for kids", dataAiHint: "interactive museum" },
  ],
  userReviews: [
    { id: "r1", user: "Chris P.", rating: 5, comment: "Incredible collection and beautifully curated. Spent the whole afternoon here!", date: "2024-04-10" },
    { id: "r2", user: "Jordan B.", rating: 4, comment: "Great museum, very informative. Some sections were a bit crowded.", date: "2024-03-22" },
  ],
  website: "https://examplemuseum.com", // Placeholder
  expectedCrowdLevel: "Moderate", // New field
  contactInfo: "info@examplemuseum.com / +1-555-ART-MUSEUM" // New field
};

export default function AttractionProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState(mockAttractionDetails.photos[0]);
  
  // In a real app, fetch data based on params.id
  // For now, we use mockAttractionDetails regardless of ID.
   useEffect(() => {
    // This is just to simulate fetching data based on ID, or if ID doesn't match mock
    if (params.id !== mockAttractionDetails.id) {
        // console.warn("Displaying mock data for 'City Museum of Art' as ID doesn't match or is generic.");
    }
    setCurrentImage(mockAttractionDetails.photos[0]);
  }, [params.id]);


  const handleBookTickets = () => {
    toast({ title: "Book Tickets (Demo)", description: `Proceeding to ticket booking for ${mockAttractionDetails.name}. QR code ticketing would be simulated here.` });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockAttractionDetails.name,
        text: `Check out this cool attraction: ${mockAttractionDetails.name}`,
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
    toast({ title: "Augmented Reality View", description: "AR landmark identification feature is under development. (Placeholder for historical facts, directions)" });
  };


  if (!mockAttractionDetails) { 
    return <div>Loading attraction details...</div>; 
  }

  const getCrowdLevelIcon = (level: string) => {
    if (level === "Low") return <Users className="inline h-4 w-4 mr-1 text-green-500"/>;
    if (level === "Moderate") return <Users className="inline h-4 w-4 mr-1 text-yellow-500"/>;
    if (level === "High") return <Users2 className="inline h-4 w-4 mr-1 text-red-500"/>;
    return <Users className="inline h-4 w-4 mr-1 text-muted-foreground"/>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{mockAttractionDetails.name}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-5 w-5" /> <span>{mockAttractionDetails.location}</span>
                <Separator orientation="vertical" className="h-5" />
                <Star className="h-5 w-5 text-yellow-400" /> <span>{mockAttractionDetails.rating} ({mockAttractionDetails.reviewsCount} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleToggleFavorite} aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}>
                      <Heart className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorited ? "Remove from wishlist" : "Add to wishlist"}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                      <Share2 className="h-6 w-6 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 md:px-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:max-h-[500px] overflow-hidden rounded-md">
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer" onClick={() => setCurrentImage(mockAttractionDetails.photos[0])}>
              <Image src={currentImage.src} alt={currentImage.alt} layout="fill" objectFit="cover" className="rounded-l-md" data-ai-hint={currentImage.dataAiHint} />
            </div>
            {mockAttractionDetails.photos.slice(1, 5).map((photo, index) => (
              <div key={photo.id} className={`relative aspect-[4/3] md:aspect-auto cursor-pointer ${index > 1 ? 'hidden md:block' : ''}`} onClick={() => setCurrentImage(photo)}>
                <Image src={photo.src} alt={photo.alt} layout="fill" objectFit="cover" className={index === 1 ? "md:rounded-tr-md" : index === 3 ? "md:rounded-br-md" : ""} data-ai-hint={photo.dataAiHint} />
              </div>
            ))}
          </div>
           <div className="mt-2 flex gap-2 overflow-x-auto p-2 md:hidden">
             {mockAttractionDetails.photos.map(photo => (
                 <Image key={photo.id} src={photo.src} alt={photo.alt} width={80} height={60} className={`rounded object-cover cursor-pointer ${currentImage.id === photo.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setCurrentImage(photo)} data-ai-hint={photo.dataAiHint}/>
             ))}
          </div>
           <div className="text-center mt-2">
             <Button variant="outline" onClick={handleArView}><Camera className="mr-2 h-4 w-4" /> Try AR Discovery (Demo)</Button>
           </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">About {mockAttractionDetails.name}</h3>
              <p className="text-muted-foreground whitespace-pre-line">{mockAttractionDetails.description}</p>
            </div>
             <div>
              <h3 className="text-xl font-semibold mb-2">Details</h3>
              <p className="text-sm text-muted-foreground"><strong><Clock className="inline h-4 w-4 mr-1"/>Opening Hours:</strong> {mockAttractionDetails.openingHours}</p>
              <p className="text-sm text-muted-foreground"><strong><Ticket className="inline h-4 w-4 mr-1"/>Ticket Price:</strong> {mockAttractionDetails.ticketPrice}</p>
              <p className="text-sm text-muted-foreground"><strong>{getCrowdLevelIcon(mockAttractionDetails.expectedCrowdLevel)}Expected Crowd:</strong> {mockAttractionDetails.expectedCrowdLevel}</p>
              <p className="text-sm text-muted-foreground"><strong><MessageSquare className="inline h-4 w-4 mr-1"/>Contact:</strong> {mockAttractionDetails.contactInfo}</p>
              {mockAttractionDetails.website && 
                <p className="text-sm text-muted-foreground"><strong><ExternalLink className="inline h-4 w-4 mr-1"/>Website:</strong> <a href={mockAttractionDetails.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{mockAttractionDetails.website}</a></p>
              }
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Amenities/Features</h3>
              <div className="flex flex-wrap gap-2">
                {mockAttractionDetails.amenities.map(amenity => (
                  <Badge key={amenity} variant="secondary">{amenity}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Visitor Photo Gallery (Demo)</h3>
              <div className="grid grid-cols-3 gap-2">
                 {mockAttractionDetails.photos.slice(1,4).map((photo, i) => (
                    <Image key={`gallery-${i}`} src={photo.src} alt={photo.alt} width={150} height={100} className="rounded-md object-cover" data-ai-hint={photo.dataAiHint}/>
                 ))}
              </div>
               <p className="text-xs text-muted-foreground mt-1">Curated photos from visitors.</p>
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
          </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent>
          <h3 className="text-2xl font-semibold mb-4">Visitor Reviews ({mockAttractionDetails.reviewsCount})</h3>
          <div className="space-y-6">
            {mockAttractionDetails.userReviews.map(review => (
              <Card key={review.id} className="bg-muted/30">
                <CardHeader className="flex flex-row justify-between items-center pb-2">
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {review.user.substring(0,1)}
                    </div>
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
                        <li>"Go early to avoid crowds, especially on weekends."</li>
                        <li>"The audio guide is worth it for a richer experience."</li>
                        <li>"Check out the special exhibit on the second floor!"</li>
                    </ul>
                </CardContent>
            </Card>
            <Button variant="outline">Show all {mockAttractionDetails.reviewsCount} reviews</Button>
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
  );
}
