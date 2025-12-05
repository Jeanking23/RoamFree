
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Search, Building, CarFront, MapPin, DollarSign, GitCompareArrows, LandPlot, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

// Mock data - replace with actual data from user's wishlist
const mockWishlistItems = [
  { id: "stay001", type: "Stay", name: "Mountain Cabin Retreat", location: "Aspen, CO", price: "250/night", image: "https://placehold.co/600x400.png?text=Cabin+Wishlist", dataAiHint: "cabin mountain", link: "/stays/stay001", photos: [{id: 'p1', src: "https://placehold.co/600x400.png?text=Cabin+1", dataAiHint: "cabin mountain"}, {id: 'p2', src: "https://placehold.co/600x400.png?text=Cabin+2", dataAiHint: "cabin interior"}] },
  { id: "car002", type: "Car", name: "Jeep Wrangler Unlimited", location: "Moab, UT", price: "120/day", image: "https://placehold.co/600x400.png?text=Jeep+Wishlist", dataAiHint: "jeep offroad", link: "/car-rent#car002", photos: [{id: 'p1', src: "https://placehold.co/600x400.png?text=Jeep+1", dataAiHint: "jeep offroad"}, {id: 'p2', src: "https://placehold.co/600x400.png?text=Jeep+2", dataAiHint: "jeep interior"}] },
  { id: "land003", type: "Land", name: "Coastal Plot with Ocean View", location: "Big Sur, CA", price: "750,000", image: "https://placehold.co/600x400.png?text=Land+Wishlist", dataAiHint: "coastal land", link: "/buy-property#land003", photos: [{id: 'p1', src: "https://placehold.co/600x400.png?text=Land+1", dataAiHint: "coastal land"}, {id: 'p2', src: "https://placehold.co/600x400.png?text=Land+2", dataAiHint: "ocean view"}] },
];

function WishlistItemImageSlider({ item }: { item: typeof mockWishlistItems[0] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % item.photos.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + item.photos.length) % item.photos.length);
  };

  return (
    <div className="relative w-full h-56 group">
      <Link href={item.link} className="block w-full h-full">
        <Image 
          src={item.photos[currentIndex].src} 
          alt={item.name} 
          fill 
          className="object-cover" 
          data-ai-hint={item.photos[currentIndex].dataAiHint}
        />
      </Link>
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <Search className="h-12 w-12 text-white opacity-0 group-hover:opacity-75 transition-opacity" />
      </div>
       {item.photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 text-foreground opacity-0 group-hover:opacity-100 hover:bg-background/80"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 text-foreground opacity-0 group-hover:opacity-100 hover:bg-background/80"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
}


export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(mockWishlistItems);
  const [selectedToCompare, setSelectedToCompare] = useState<string[]>([]);

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Removed from Wishlist", description: "The item has been removed from your wishlist." });
  };

  const handleToggleCompare = (itemId: string) => {
    setSelectedToCompare(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleCompareSelected = () => {
    if (selectedToCompare.length < 2) {
      toast({ title: "Select More Items", description: "Please select at least two items to compare.", variant: "destructive" });
      return;
    }
    toast({ title: "Compare (Demo)", description: `Comparing ${selectedToCompare.length} items. Feature coming soon!` });
    // In a real app, navigate to a comparison page or show a modal
    console.log("Comparing items:", selectedToCompare);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Heart className="h-10 w-10 fill-primary text-primary-foreground" />
            My Wishlist
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your saved properties, cars, and land listings. Compare and book your favorites.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-md">
              <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-xl font-semibold">Your wishlist is empty.</p>
              <p className="text-muted-foreground mb-4">Start exploring and save items you love!</p>
              <Button asChild>
                <Link href="/">
                  <span><Search className="mr-2 h-4 w-4" /> Explore RoamFree</span>
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-end">
                <Button onClick={handleCompareSelected} disabled={selectedToCompare.length < 2} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <span className="flex items-center gap-2"><GitCompareArrows className="h-4 w-4" /> Compare Selected ({selectedToCompare.length})</span>
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map(item => (
                  <Card key={item.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                     <WishlistItemImageSlider item={item} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-semibold hover:text-primary">
                            <Link href={item.link}>{item.name}</Link>
                        </CardTitle>
                        {item.type === "Stay" && <Building className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                        {item.type === "Car" && <CarFront className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                        {item.type === "Land" && <LandPlot className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                      </div>
                      <CardDescription className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-primary" /> {item.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-lg font-semibold text-primary flex items-center">
                        <DollarSign className="h-5 w-5 mr-1" /> {item.price}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t">
                       <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`compare-${item.id}`}
                            checked={selectedToCompare.includes(item.id)}
                            onCheckedChange={() => handleToggleCompare(item.id)}
                        />
                        <label
                            htmlFor={`compare-${item.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Compare
                        </label>
                        </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={() => handleRemoveFromWishlist(item.id)}>
                        <span className="flex items-center gap-2"><Trash2 className="h-4 w-4" /> Remove</span>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
