
// src/app/cars-for-sale/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Gauge, DollarSign, MapPin, Info, ShieldCheck, MessageCircle, CarFront, FileText, UserCheck, Eye, Share2, Heart, AlertTriangle, Settings, CheckCircle, TvIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data - in a real app, you'd fetch this based on params.id
const mockCarForSaleDetails = {
  id: "carSale1",
  name: "Well-Maintained Toyota Corolla 2018",
  price: 15000,
  location: "Cityville, CA",
  mileage: "45,000 miles",
  year: 2018,
  vin: "DEMOVIN12345ABC",
  engine: "1.8L 4-Cylinder",
  transmission: "Automatic",
  fuelType: "Gasoline",
  exteriorColor: "Silver",
  interiorColor: "Black",
  description: "A reliable and fuel-efficient 2018 Toyota Corolla, perfect for city driving and daily commutes. Regularly serviced with a clean title and no accident history. Features include a rearview camera, Bluetooth connectivity, and adaptive cruise control.",
  features: ["Rearview Camera", "Bluetooth", "Adaptive Cruise Control", "Keyless Entry", "Power Windows", "Air Conditioning"],
  photos: [
    { id: "p1", src: "https://placehold.co/800x600.png?text=Corolla+Front", alt: "Corolla front view", dataAiHint: "sedan silver front" },
    { id: "p2", src: "https://placehold.co/400x300.png?text=Corolla+Interior", alt: "Corolla interior", dataAiHint: "car interior dashboard" },
    { id: "p3", src: "https://placehold.co/400x300.png?text=Corolla+Side", alt: "Corolla side profile", dataAiHint: "sedan silver side" },
    { id: "p4", src: "https://placehold.co/400x300.png?text=Corolla+Engine", alt: "Corolla engine bay", dataAiHint: "car engine" },
  ],
  seller: { name: "John Doe", rating: 4.8, responseRate: "95%", memberSince: "2022", isVerified: true, avatar: "https://placehold.co/100x100.png?text=JD", dataAiHint: "man portrait" },
  vehicleHistoryReport: { summary: "Clean title, No accidents reported, 2 previous owners, Regular maintenance records available.", link: "#" },
  inspectionReport: { summary: "Passed 150-point inspection. Brakes and tires in good condition.", link: "#" }
};

export default function CarSaleProfilePage() {
  const params = useParams();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImage, setCurrentImage] = useState(mockCarForSaleDetails.photos[0]);
  
  useEffect(() => {
    if (params.id !== mockCarForSaleDetails.id) {
      // console.warn("Displaying mock data as ID doesn't match.");
    }
    setCurrentImage(mockCarForSaleDetails.photos[0]);
  }, [params.id]);

  const handleMakeOffer = () => {
    toast({ title: "Make Offer (Demo)", description: `Initiating offer for ${mockCarForSaleDetails.name}. Negotiation features would be here.` });
  };
  const handleRequestTestDrive = () => {
    toast({ title: "Test Drive Requested (Demo)", description: `Requesting a test drive for ${mockCarForSaleDetails.name}. Seller will be notified.` });
  };
  const handleChatWithSeller = () => {
    toast({ title: "Chat with Seller (Demo)", description: `Opening secure chat with ${mockCarForSaleDetails.seller.name}.`});
  };
  const handleShare = () => {
     if (navigator.share) {
      navigator.share({
        title: mockCarForSaleDetails.name,
        text: `Check out this car for sale: ${mockCarForSaleDetails.name}`,
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
   const handle360VideoTour = () => {
    toast({ title: "360° Video Tour (Demo)", description: "Playing immersive 360° video tour of the car. (Placeholder)" });
  };

  if (!mockCarForSaleDetails) { 
    return <div>Loading car details...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{mockCarForSaleDetails.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground mt-1">
                <span className="flex items-center"><MapPin className="h-5 w-5 mr-1" /> {mockCarForSaleDetails.location}</span>
                <Separator orientation="vertical" className="h-5 hidden sm:block" />
                <span className="flex items-center"><DollarSign className="h-5 w-5 text-green-600 mr-1" /> {mockCarForSaleDetails.price.toLocaleString()}</span>
                <Separator orientation="vertical" className="h-5 hidden sm:block" />
                <span className="flex items-center"><CalendarDays className="h-5 w-5 mr-1" /> {mockCarForSaleDetails.year}</span>
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
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto cursor-pointer" onClick={() => setCurrentImage(mockCarForSaleDetails.photos[0])}>
              <Image src={currentImage.src} alt={currentImage.alt} layout="fill" objectFit="cover" className="rounded-l-md" data-ai-hint={currentImage.dataAiHint} />
            </div>
            {mockCarForSaleDetails.photos.slice(1, 5).map((photo, index) => (
              <div key={photo.id} className={`relative aspect-[4/3] md:aspect-auto cursor-pointer ${index > 1 ? 'hidden md:block' : ''}`} onClick={() => setCurrentImage(photo)}>
                <Image src={photo.src} alt={photo.alt} layout="fill" objectFit="cover" className={index === 1 ? "md:rounded-tr-md" : index === 3 ? "md:rounded-br-md" : ""} data-ai-hint={photo.dataAiHint} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto p-2 md:hidden">
             {mockCarForSaleDetails.photos.map(photo => (
                 <Image key={photo.id} src={photo.src} alt={photo.alt} width={80} height={60} className={`rounded object-cover cursor-pointer ${currentImage.id === photo.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setCurrentImage(photo)} data-ai-hint={photo.dataAiHint}/>
             ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={handle360VideoTour}><TvIcon className="mr-2 h-4 w-4" /> View 360° Video Tour (Demo)</Button>
          </div>
        </CardContent>
        
        <Separator className="my-6" />

        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Car Details</h3>
              <p className="text-muted-foreground whitespace-pre-line mb-4">{mockCarForSaleDetails.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <p><strong>Mileage:</strong> {mockCarForSaleDetails.mileage}</p>
                <p><strong>Engine:</strong> {mockCarForSaleDetails.engine}</p>
                <p><strong>Transmission:</strong> {mockCarForSaleDetails.transmission}</p>
                <p><strong>Fuel Type:</strong> {mockCarForSaleDetails.fuelType}</p>
                <p><strong>Exterior:</strong> {mockCarForSaleDetails.exteriorColor}</p>
                <p><strong>Interior:</strong> {mockCarForSaleDetails.interiorColor}</p>
                <p className="col-span-full sm:col-span-1"><strong>VIN:</strong> {mockCarForSaleDetails.vin} (Demo)</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground">
                {mockCarForSaleDetails.features.map(feature => (
                  <li key={feature} className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {feature}</li>
                ))}
              </ul>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/>Vehicle Reports (Demo)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <h4 className="font-medium">Vehicle History Report:</h4>
                        <p className="text-muted-foreground">{mockCarForSaleDetails.vehicleHistoryReport.summary}</p>
                        <Button variant="link" size="sm" className="px-0 h-auto" asChild><Link href={mockCarForSaleDetails.vehicleHistoryReport.link}>View Full Report (Demo)</Link></Button>
                    </div>
                    <div>
                        <h4 className="font-medium">Inspection Report:</h4>
                        <p className="text-muted-foreground">{mockCarForSaleDetails.inspectionReport.summary}</p>
                        <Button variant="link" size="sm" className="px-0 h-auto" asChild><Link href={mockCarForSaleDetails.inspectionReport.link}>View Full Report (Demo)</Link></Button>
                    </div>
                </CardContent>
            </Card>
             <div className="md:hidden"> 
              <Separator className="my-6" />
              <SellerInfo />
              <Separator className="my-6" />
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="shadow-md border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">${mockCarForSaleDetails.price.toLocaleString()}</CardTitle>
                <CardDescription>Contact seller to make an offer or schedule a test drive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleMakeOffer}>
                  <DollarSign className="mr-2 h-5 w-5" /> Make an Offer (Demo)
                </Button>
                <Button variant="outline" className="w-full" onClick={handleRequestTestDrive}>
                  <CarFront className="mr-2 h-4 w-4" /> Request Test Drive (Demo)
                </Button>
                <p className="text-xs text-muted-foreground text-center">Secure Escrow Payment Available (Demo)</p>
                <p className="text-xs text-muted-foreground text-center">Financing options available through partners (Demo).</p>
              </CardContent>
            </Card>
            <div className="hidden md:block">
              <SellerInfo />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-5 w-5 text-orange-500"/>
                <span>Report this listing if you find any issues. (Placeholder)</span>
            </div>
             <p className="text-xs text-muted-foreground">All listings subject to verification. RoamFree facilitates connections, inspect vehicles thoroughly.</p>
        </CardFooter>
      </Card>
    </div>
  );
}


function SellerInfo() {
    const handleChatWithSeller = () => {
        toast({ title: "Chat with Seller (Demo)", description: `Opening secure chat with ${mockCarForSaleDetails.seller.name}.`});
    };
  return (
    <Card className="border bg-background shadow-md">
        <CardHeader className="text-center">
        <Image src={mockCarForSaleDetails.seller.avatar} alt={mockCarForSaleDetails.seller.name} width={80} height={80} className="rounded-full mx-auto mb-2" data-ai-hint={mockCarForSaleDetails.seller.dataAiHint} />
        <CardTitle className="text-xl">Sold by {mockCarForSaleDetails.seller.name}</CardTitle>
        <CardDescription>
            {mockCarForSaleDetails.seller.isVerified && <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300 mr-1"><UserCheck className="mr-1 h-3 w-3"/>Verified Seller</Badge>}
            Rating: {mockCarForSaleDetails.seller.rating}/5 (Demo)
        </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-2">
        <Button variant="outline" className="w-full" onClick={handleChatWithSeller}>
            <MessageSquare className="mr-2 h-4 w-4" /> Chat with Seller
        </Button>
        <p className="text-xs text-muted-foreground">Response Rate: {mockCarForSaleDetails.seller.responseRate} (Demo)</p>
        <p className="text-xs text-muted-foreground">Member Since: {mockCarForSaleDetails.seller.memberSince}</p>
        </CardContent>
    </Card>
  );
}
