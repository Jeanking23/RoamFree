// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Clock, CalendarDays, LocateFixed, Compass, Star, Wand2, Home, Briefcase, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import InteractiveMapPlaceholder from '@/components/map/interactive-map-placeholder';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { getSavedPlacesAction, addSavedPlaceAction } from '@/app/actions';
import type { SavedPlace } from '@/services/places';
import { Label } from '@/components/ui/label';

const serviceCategories = [
  { name: 'Ride', icon: Car, link: '#ride-booking' },
  { name: 'Bus Tickets', icon: Bus, link: '/bus-transportation' },
  { name: 'Rental Car', icon: CarFront, link: '/car-rent' },
  { name: 'Flights', icon: Plane, link: '/flights' },
];

const suggestionItems = [
    {
      title: 'Ride',
      description: 'Request a ride now, or schedule one for later.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'car road',
      link: '#ride-booking',
    },
    {
      title: 'Reserve',
      description: 'Advance book a ride up to 30 days.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'calendar car',
      link: '#ride-booking',
    },
    {
      title: 'Rental Cars',
      description: 'Rent a car from a variety of models.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'rental cars',
      link: '/car-rent',
    },
    {
      title: 'Courier',
      description: 'Send packages to friends and family.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'delivery package',
      link: '/courier-delivery',
    },
    {
      title: 'Food',
      description: 'Get your favorite meals delivered.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'food delivery',
      link: '#!', // Placeholder link
    },
    {
      title: 'Grocery',
      description: 'Have groceries delivered to your door.',
      imageSrc: 'https://placehold.co/400x200.png',
      dataAiHint: 'grocery bag',
      link: '#!', // Placeholder link
    },
];

const libraries: ("places" | "maps" | "geocoding")[] = ['places', 'maps', 'geocoding'];

interface LocationInputProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    isLoaded: boolean;
    onSetLocationFromMap: () => void;
}

const LocationInput = ({ value, onValueChange, placeholder, isLoaded, onSetLocationFromMap }: LocationInputProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [view, setView] = useState<'main' | 'saved-places' | 'add-place'>('main');
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
    const [newPlaceName, setNewPlaceName] = useState('');
    const [newPlaceAddress, setNewPlaceAddress] = useState('');
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const fetchPlaces = useCallback(async () => {
        setIsLoadingPlaces(true);
        const result = await getSavedPlacesAction();
        if ('error' in result) {
            toast({ title: 'Error fetching places', description: result.error, variant: 'destructive' });
            setSavedPlaces([]);
        } else {
            setSavedPlaces(result);
        }
        setIsLoadingPlaces(false);
    }, []);

    const handleOpenPopover = () => {
        setPopoverOpen(true);
        setView('main');
    };
    
    const handleViewSavedPlaces = () => {
        fetchPlaces();
        setView('saved-places');
    };
    
    const handleAddNewPlace = async () => {
        if (!newPlaceName || !newPlaceAddress) {
            toast({ title: "Missing Information", description: "Please provide a name and address.", variant: "destructive" });
            return;
        }
        const result = await addSavedPlaceAction({ name: newPlaceName, address: newPlaceAddress });
        if ('error' in result) {
            toast({ title: "Error Saving Place", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Place Saved!", description: `${newPlaceName} has been added to your saved places.` });
            setNewPlaceName('');
            setNewPlaceAddress('');
            handleViewSavedPlaces(); // Refresh list and go back
        }
    };
    
    const handleAllowLocationAccess = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        onValueChange(results[0].formatted_address);
                        setPopoverOpen(false);
                    } else {
                        toast({ title: "Error", description: "Could not determine address from location.", variant: "destructive" });
                    }
                });
            }, (error) => {
                toast({ title: "Geolocation Error", description: error.message, variant: "destructive" });
            });
        } else {
            toast({ title: "Unsupported", description: "Geolocation is not supported by this browser.", variant: "destructive" });
        }
    };
    
    const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    }, []);
    
    const onPlaceChanged = useCallback(() => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) {
                onValueChange(place.formatted_address);
                setPopoverOpen(false);
            }
        }
    }, [onValueChange, setPopoverOpen]);

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full" onClick={handleOpenPopover}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    </div>
                    <Input
                        placeholder={placeholder}
                        value={value}
                        readOnly
                        className="pl-10 cursor-pointer"
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                {view === 'main' && (
                    <div className="flex flex-col">
                        <div className="p-4 space-y-4">
                            <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={handleViewSavedPlaces}>
                                <Star className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold text-left">Saved places</p>
                                </div>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={handleAllowLocationAccess}>
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                    <LocateFixed className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-left">Allow location access</p>
                                    <p className="text-xs text-muted-foreground text-left">It provides your pickup address</p>
                                </div>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={() => { onSetLocationFromMap(); setPopoverOpen(false); }}>
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                     <Compass className="h-5 w-5 text-primary" />
                                </div>
                                 <div>
                                    <p className="font-semibold text-left">Set location on map</p>
                                </div>
                            </Button>
                        </div>
                        <Separator />
                        {isLoaded && (
                            <div className="p-4">
                                <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged} options={{ fields: ["formatted_address", "name", "geometry"], types: ["address"] }}>
                                    <Input placeholder={placeholder} className="w-full" />
                                </Autocomplete>
                            </div>
                        )}
                    </div>
                )}
                 {view === 'saved-places' && (
                    <div className="space-y-1 p-2">
                        <Button variant="ghost" className="w-full justify-start" onClick={() => setView('main')}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
                        <Separator />
                        {isLoadingPlaces ? <p className="p-2 text-sm">Loading...</p> : savedPlaces.map(place => (
                             <Button key={place.id} variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={() => { onValueChange(place.address); setPopoverOpen(false); }}>
                                {place.name.toLowerCase() === 'home' ? <Home className="h-5 w-5 text-primary"/> : place.name.toLowerCase() === 'work' ? <Briefcase className="h-5 w-5 text-primary"/> : <MapPin className="h-5 w-5 text-primary"/>}
                                <div>
                                    <p className="font-semibold text-left">{place.name}</p>
                                    <p className="text-xs text-muted-foreground text-left">{place.address}</p>
                                </div>
                            </Button>
                        ))}
                         <Button variant="ghost" className="w-full justify-start gap-3 h-auto text-sm text-primary" onClick={() => setView('add-place')}>
                            <Plus className="h-4 w-4 mr-2"/> Add new place
                        </Button>
                    </div>
                )}
                {view === 'add-place' && (
                     <div className="space-y-4 p-4">
                        <Button variant="ghost" size="sm" className="w-full justify-start px-0" onClick={() => setView('saved-places')}><ArrowLeft className="mr-2 h-4 w-4"/> Back to saved places</Button>
                         <div>
                            <Label htmlFor="place-name">Name</Label>
                            <Input id="place-name" value={newPlaceName} onChange={e => setNewPlaceName(e.target.value)} placeholder="e.g., Gym"/>
                         </div>
                         <div>
                            <Label htmlFor="place-address">Address</Label>
                             <Input id="place-address" value={newPlaceAddress} onChange={e => setNewPlaceAddress(e.target.value)} placeholder="Enter full address"/>
                         </div>
                         <Button className="w-full" onClick={handleAddNewPlace}>Save Place</Button>
                     </div>
                )}
            </PopoverContent>
        </Popover>
    );
};


export default function TransportPage() {
    const router = useRouter();
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState('');
    const mapRef = useRef<google.maps.Map | null>(null);
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    useEffect(() => {
        const now = new Date();
        setDate(now);
        setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, []);

    const handleSearch = () => {
        if (!pickupLocation || !dropoffLocation) {
            toast({
                title: 'Missing Information',
                description: 'Please select both pickup and dropoff locations.',
                variant: 'destructive',
            });
            return;
        }
        
        const query = new URLSearchParams({
            from: pickupLocation,
            to: dropoffLocation,
            date: date?.toISOString() || new Date().toISOString(),
            time: time,
        });

        router.push(`/transport/search?${query.toString()}`);
    };
    
    const handleSetLocationFromMap = (locationType: 'pickup' | 'dropoff') => {
        if (!mapRef.current) return;
        const center = mapRef.current.getCenter();
        if (!center) return;

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: center }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                if (locationType === 'pickup') {
                    setPickupLocation(address);
                } else {
                    setDropoffLocation(address);
                }
                toast({ title: 'Location Set', description: `Set ${locationType} location from map.` });
            } else {
                toast({ title: 'Error', description: 'Could not determine address from map center.', variant: 'destructive' });
            }
        });
    };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center gap-3 text-3xl font-headline text-primary">
            <Car className="h-8 w-8" />
            Transportation Hub
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your one-stop solution for getting around. Book rides, buses, rentals, and flights.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {serviceCategories.map((service) => (
              <Link key={service.name} href={service.link} passHref>
                 <Card className="text-center p-4 hover:bg-accent/10 hover:shadow-md transition-all cursor-pointer h-full flex flex-col justify-center items-center">
                  <service.icon className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="font-semibold">{service.name}</p>
                </Card>
              </Link>
            ))}
          </div>
          
          <Separator className="my-8" />

          <div id="ride-booking" className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="hidden lg:block rounded-lg overflow-hidden h-96 lg:h-[32rem] sticky top-24">
                <InteractiveMapPlaceholder 
                    pickup={pickupLocation} 
                    dropoff={dropoffLocation} 
                    onMapLoad={(map) => { mapRef.current = map; }}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Book a Ride</h3>
                <div className="space-y-4">
                     <LocationInput
                        value={pickupLocation}
                        onValueChange={setPickupLocation}
                        placeholder="Pickup location"
                        isLoaded={isLoaded}
                        onSetLocationFromMap={() => handleSetLocationFromMap('pickup')}
                    />
                    <LocationInput
                        value={dropoffLocation}
                        onValueChange={setDropoffLocation}
                        placeholder="Destination"
                        isLoaded={isLoaded}
                        onSetLocationFromMap={() => handleSetLocationFromMap('dropoff')}
                    />
                   
                    <div className="grid grid-cols-2 gap-2">
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Today</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <div className="relative">
                           <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                           <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="pl-9"/>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="w-full" onClick={handleSearch}><Search className="mr-2 h-4 w-4"/>Search Rides</Button>
                    </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-8" />
       
      <Card className="bg-accent/10 border-accent/30 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-headline text-accent-foreground flex items-center gap-2">
            <Wand2 className="h-7 w-7 text-accent" />Still planning? Let our AI help.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our AI Trip Planner can build a custom itinerary for you, including transport, stays, and activities.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm hover:shadow-md transition-shadow" asChild>
            <Link href="/ai-trip-planner">Start Planning with AI</Link>
          </Button>
        </CardFooter>
      </Card>

      <Separator className="my-8" />

      <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Suggestions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestionItems.map((item) => (
                    <Card key={item.title} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all">
                        <div className="relative h-40 w-full">
                            <Image src={item.imageSrc} alt={item.title} fill className="object-cover" data-ai-hint={item.dataAiHint} />
                        </div>
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" asChild className="w-full">
                                <Link href={item.link}>Details</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
      
    </div>
  );
}
