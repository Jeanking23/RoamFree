// src/app/cars-for-sale/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Gauge, DollarSign, MapPin, Info, ShieldCheck, MessageSquare, CarFront, FileText, UserCheck, Eye, Share2, Heart, AlertTriangle, Settings, CheckCircle, TvIcon, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';

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
    { id: "p1", src: "https://placehold.co/800x600.png", alt: "Corolla front view", dataAiHint: "sedan silver front" },
    { id: "p2", src: "https://placehold.co/400x300.png", alt: "Corolla interior", dataAiHint: "car interior dashboard" },
    { id: "p3", src: "https://placehold.co/400x300.png", alt: "Corolla side profile", dataAiHint: "sedan silver side" },
    { id: "p4", src: "https://placehold.co/400x300.png", alt: "Corolla engine bay", dataAiHint: "car engine" },
  ],
  seller: { name: "John Doe", rating: 4.8, responseRate: "95%", memberSince: "2022", isVerified: true, avatar: "https://placehold.co/100x100.png", dataAiHint: "man portrait" },
  vehicleHistoryReport: { summary: "Clean title, No accidents reported, 2 previous owners, Regular maintenance records available.", link: "#" },
  inspectionReport: { summary: "Passed 150-point inspection. Brakes and tires in good condition.", link: "#" }
};

export default function CarSaleProfilePage() {
  const params = useParams();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for dialogs
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [testDriveDate, setTestDriveDate] = useState<Date | undefined>(new Date());
  const [testDriveTime, setTestDriveTime] = useState('10:00');
  
  useEffect(() => {
    if (params.id !== mockCarForSaleDetails.id) {
      // console.warn("Displaying mock data as ID doesn't match.");
    }
  }, [params.id]);

  const currentImage = mockCarForSaleDetails.photos[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mockCarForSaleDetails.photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + mockCarForSaleDetails.photos.length) % mockCarForSaleDetails.photos.length);
  };

  const handleMakeOffer = () => {
    if (!offerAmount) {
      toast({ title: "Please enter an offer amount.", variant: "destructive"});
      return false; // Prevent closing dialog
    }
    toast({ title: "Offer Submitted", description: `Your offer of $${offerAmount} for the ${mockCarForSaleDetails.name} has been sent to the seller.` });
    setOfferAmount('');
    setOfferMessage('');
    return true; // Allow closing dialog
  };
  const handleRequestTestDrive = () => {
     if (!testDriveDate || !testDriveTime) {
      toast({ title: "Please select a date and time.", variant: "destructive"});
      return false; // Prevent closing dialog
    }
    toast({ title: "Test Drive Requested", description: `Your request for a test drive on ${testDriveDate.toLocaleDateString()} at ${testDriveTime} has been sent.` });
    return true;
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
    toast({ title: "360° Video Tour", description: "Playing immersive 360° video tour of the car." });
  };

  if (!mockCarForSaleDetails) { 
    return <div>Loading car details...</div>;
  }

  return (
    <>
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
          <div className="relative w-full max-w-3xl mx-auto">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              {currentImage && (
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out"
                  dataAiHint={currentImage.dataAiHint}
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
            {mockCarForSaleDetails.photos.map((photo, index) => (
              <Image
                key={photo.id}
                src={photo.src}
                alt={photo.alt}
                width={80}
                height={60}
                className={`rounded object-cover cursor-pointer transition-all ${currentImageIndex === index ? 'ring-2 ring-primary scale-105' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setCurrentImageIndex(index)}
                dataAiHint={photo.dataAiHint}
              />
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={handle360VideoTour}><TvIcon className="mr-2 h-4 w-4" /> View 360° Video Tour</Button>
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
                <p className="col-span-full sm:col-span-1"><strong>VIN:</strong> {mockCarForSaleDetails.vin}</p>
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
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/>Vehicle Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div>
                        <h4 className="font-medium">Vehicle History Report:</h4>
                        <p className="text-muted-foreground">{mockCarForSaleDetails.vehicleHistoryReport.summary}</p>
                        <Button variant="link" size="sm" className="px-0 h-auto" asChild><Link href={mockCarForSaleDetails.vehicleHistoryReport.link}>View Full Report</Link></Button>
                    </div>
                    <div>
                        <h4 className="font-medium">Inspection Report:</h4>
                        <p className="text-muted-foreground">{mockCarForSaleDetails.inspectionReport.summary}</p>
                        <Button variant="link" size="sm" className="px-0 h-auto" asChild><Link href={mockCarForSaleDetails.inspectionReport.link}>View Full Report</Link></Button>
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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="accent" size="lg" className="w-full">
                            <DollarSign className="mr-2 h-5 w-5" /> Make an Offer
                        </Button>
                    </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Make an Offer</DialogTitle>
                            <DialogDescription>Submit your offer to the seller. All offers are considered.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                             <div>
                                <Label htmlFor="offer-amount">Your Offer Amount (USD)</Label>
                                <Input id="offer-amount" type="number" placeholder={`e.g., ${mockCarForSaleDetails.price * 0.95}`} value={offerAmount} onChange={e => setOfferAmount(e.target.value)} />
                             </div>
                             <div>
                                <Label htmlFor="offer-message">Message to Seller (Optional)</Label>
                                <Textarea id="offer-message" placeholder="Include any questions or comments with your offer." value={offerMessage} onChange={e => setOfferMessage(e.target.value)}/>
                             </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <DialogClose asChild><Button onClick={handleMakeOffer}>Submit Offer</Button></DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <CarFront className="mr-2 h-4 w-4" /> Request Test Drive
                        </Button>
                    </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request a Test Drive</DialogTitle>
                            <DialogDescription>Select a preferred date and time.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 flex flex-col sm:flex-row gap-4">
                            <Calendar mode="single" selected={testDriveDate} onSelect={setTestDriveDate} className="rounded-md border"/>
                            <div className="space-y-2">
                                <Label>Preferred Time</Label>
                                {['10:00 AM', '02:00 PM', '05:00 PM'].map(time => (
                                    <Button key={time} variant={testDriveTime === time ? 'default' : 'outline'} className="w-full" onClick={() => setTestDriveTime(time)}>{time}</Button>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                             <DialogClose asChild><Button onClick={handleRequestTestDrive}>Send Request</Button></DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <p className="text-xs text-muted-foreground text-center">Secure Escrow Payment Available</p>
                <p className="text-xs text-muted-foreground text-center">Financing options available through partners.</p>
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
                <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground" onClick={() => toast({ title: 'Report Submitted', description: 'Thank you for your feedback.' })}>
                    Report this listing if you find any issues.
                </Button>
            </div>
             <p className="text-xs text-muted-foreground">All listings subject to verification. RoamFree facilitates connections, inspect vehicles thoroughly.</p>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}


function SellerInfo() {
    const handleChatWithSeller = () => {
        toast({ title: "Chat with Seller", description: `Opening secure chat with ${mockCarForSaleDetails.seller.name}.`});
    };
  return (
    <Card className="border bg-background shadow-md">
        <CardHeader className="text-center">
        <Image src={mockCarForSaleDetails.seller.avatar} alt={mockCarForSaleDetails.seller.name} width={80} height={80} className="rounded-full mx-auto mb-2" data-ai-hint={mockCarForSaleDetails.seller.dataAiHint} />
        <CardTitle className="text-xl">Sold by {mockCarForSaleDetails.seller.name}</CardTitle>
        <CardDescription>
            {mockCarForSaleDetails.seller.isVerified && <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300 mr-1"><UserCheck className="mr-1 h-3 w-3"/>Verified Seller</Badge>}
            Rating: {mockCarForSaleDetails.seller.rating}/5
        </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-2">
        <Button variant="outline" className="w-full" onClick={handleChatWithSeller}>
            <MessageSquare className="mr-2 h-4 w-4" /> Chat with Seller
        </Button>
        <p className="text-xs text-muted-foreground">Response Rate: {mockCarForSaleDetails.seller.responseRate}</p>
        <p className="text-xs text-muted-foreground">Member Since: {mockCarForSaleDetails.seller.memberSince}</p>
        </CardContent>
    </Card>
  );
}
