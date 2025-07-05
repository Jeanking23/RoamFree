
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Landmark, Search, Ticket, Eye, MapPin, Camera, Sparkles, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const mockAttractions = [
  { id: "attr1", name: "City Museum of Art", category: "Culture", image: "https://placehold.co/600x400.png?text=Art+Museum", dataAiHint: "art museum", location: "Downtown" },
  { id: "attr2", name: "Riverside Park & Trails", category: "Nature", image: "https://placehold.co/600x400.png?text=Riverside+Park", dataAiHint: "park nature", location: "West End" },
  { id: "attr3", name: "Starlight Concert Hall", category: "Nightlife", image: "https://placehold.co/600x400.png?text=Concert+Hall", dataAiHint: "concert hall", location: "Entertainment District" },
  { id: "attr4", name: "Adventure Zipline Tours", category: "Adventure", image: "https://placehold.co/600x400.png?text=Zipline", dataAiHint: "zipline adventure", location: "Mountain View" },
  { id: "attr5", name: "Children's Discovery Place", category: "Family", image: "https://placehold.co/600x400.png?text=Childrens+Museum", dataAiHint: "kids museum", location: "Suburban Area" },
];

const interestCategories = ["All", "Nature", "Nightlife", "Culture", "Family", "Adventure", "Historical"];

export default function AttractionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);

  const handleBookTickets = (attractionName: string) => {
    toast({ title: "Book Tickets (Demo)", description: `Proceeding to ticket booking for ${attractionName}.` });
  };

  const handleArDiscovery = () => {
    toast({ title: "AR Discovery Mode (Demo)", description: "Point your phone to discover landmarks! (This is a placeholder)" });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (category === "All") return ["All"];
      const newCategories = prev.includes("All") ? [] : [...prev];
      if (newCategories.includes(category)) {
        return newCategories.filter(c => c !== category);
      } else {
        return [...newCategories, category];
      }
    });
  };
  
  const filteredAttractions = mockAttractions.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.includes("All") || selectedCategories.includes(attraction.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Landmark className="h-8 w-8" />
            Discover Attractions
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Find tickets for tours, activities, and must-see local attractions. Make your trip unforgettable.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8 p-4 border rounded-lg bg-muted/30">
            <div className="grid md:grid-cols-2 gap-4 items-end mb-4">
              <div>
                <Label htmlFor="search-attractions">Search Attractions</Label>
                <div className="relative">
                  <Input 
                    id="search-attractions"
                    type="text" 
                    placeholder="e.g., Museum, Park, Tour..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <Button onClick={handleArDiscovery} variant="outline" className="w-full md:w-auto self-end">
                <Camera className="mr-2 h-4 w-4" /> Try AR Discovery Mode (Demo)
              </Button>
            </div>
            <div>
              <Label className="block mb-2 font-medium">Filter by Interest</Label>
              <div className="flex flex-wrap gap-2">
                {interestCategories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="font-normal text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {filteredAttractions.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible no-scrollbar">
              {filteredAttractions.map(attraction => (
                <Card key={attraction.id} className="flex flex-col overflow-hidden w-[80vw] sm:w-[45vw] md:w-full flex-shrink-0">
                  <Link href={`/attractions/${attraction.id}`} className="block relative w-full h-48 group">
                    <Image src={attraction.image} alt={attraction.name} fill className="object-cover" data-ai-hint={attraction.dataAiHint} />
                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Eye className="h-10 w-10 text-white opacity-0 group-hover:opacity-75 transition-opacity" />
                    </div>
                  </Link>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl hover:text-primary">
                        <Link href={`/attractions/${attraction.id}`}>{attraction.name}</Link>
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-primary" /> {attraction.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">Category: {attraction.category}</p>
                    {/* Placeholder for rating, price range etc. */}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleBookTickets(attraction.name)}>
                      <Ticket className="mr-2 h-4 w-4" /> Book Tickets (Demo)
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-8 py-12 bg-muted/50 rounded-md flex flex-col items-center justify-center">
              <p className="text-xl font-semibold text-foreground">No attractions match your criteria.</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
