
// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Clock, CalendarDays, LocateFixed, Compass, Star, Wand2, Home, Briefcase, Plus, ArrowLeft, Building } from 'lucide-react';
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


// LocationInput component with Popover
interface LocationInputProps {
  value: string;
  onLocationSelect: (location: string) => void;
  placeholder: string;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

function LocationInput({ value, onLocationSelect, placeholder, mapRef }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [popoverView, setPopoverView] = useState<'main' | 'saved_places' | 'add_place'>('main');
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');

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

  const handleSavedPlacesClick = () => {
    fetchPlaces();
    setPopoverView('saved_places');
  };
  
  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geocoder = new window.google.maps.Geocoder();
          const latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              onLocationSelect(results[0].formatted_address);
              toast({ title: "Location set!", description: "Your current location has been set." });
              setOpen(false);
            } else {
              toast({ title: 'Error', description: 'Could not get address from your location.', variant: 'destructive' });
            }
          });
        },
        () => {
          toast({ title: 'Permission Denied', description: 'Could not access your location.', variant: 'destructive' });
        }
      );
    } else {
      toast({ title: 'Not Supported', description: 'Geolocation is not supported by your browser.', variant: 'destructive' });
    }
  };

  const handleSetOnMap = () => {
    if (mapRef.current) {
        const center = mapRef.current.getCenter();
        if (center) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: center }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    onLocationSelect(results[0].formatted_address);
                    toast({ title: 'Location set from map' });
                    setOpen(false);
                } else {
                     toast({ title: 'Error', description: 'Could not get address from map center.', variant: 'destructive' });
                }
            });
        }
    } else {
         toast({ title: 'Map not ready', description: 'Please wait for the map to load.', variant: 'destructive' });
    }
  };

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        onLocationSelect(place.formatted_address);
        setOpen(false);
      }
    }
  };

  const handleAddNewPlace = async () => {
    if (!newPlaceName || !newPlaceAddress) {
        toast({ title: 'Missing fields', description: 'Please provide both name and address.', variant: 'destructive' });
        return;
    }
    const result = await addSavedPlaceAction({ name: newPlaceName, address: newPlaceAddress });
    if ('error' in result) {
        toast({ title: 'Error saving place', description: result.error, variant: 'destructive' });
    } else {
        toast({ title: 'Place Saved!', description: `${newPlaceName} has been added to your saved places.` });
        setNewPlaceName('');
        setNewPlaceAddress('');
        handleSavedPlacesClick(); // Refresh list and go back
    }
  };


  return (
    <Popover open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setPopoverView('main');
    }}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MapPin className="h-4 w-4 text-muted-foreground" />
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
        {popoverView === 'main' && (
            <div className="p-2 space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={handleSavedPlacesClick}><Building className="h-5 w-5 text-primary"/>Saved places</Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={handleAllowLocation}>
                    <LocateFixed className="h-5 w-5 text-primary"/>
                    <div className="text-left">
                        <p>Allow location access</p>
                        <p className="text-xs text-muted-foreground font-normal">It provides your pickup address</p>
                    </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={handleSetOnMap}><Compass className="h-5 w-5 text-primary"/>Set location on map</Button>
                <Separator className="my-2" />
                <div className="p-2">
                    <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
                        <Input placeholder="Enter a location" className="w-full"/>
                    </Autocomplete>
                </div>
            </div>
        )}
        {popoverView === 'saved_places' && (
            <div className="p-2">
                <Button variant="ghost" onClick={() => setPopoverView('main')} className="mb-2"><ArrowLeft className="h-4 w-4 mr-2"/>Back</Button>
                {isLoadingPlaces ? <p>Loading...</p> : (
                    <div className="space-y-1">
                        {savedPlaces.map(place => (
                            <Button key={place.id} variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={() => { onLocationSelect(place.address); setOpen(false); }}>
                                {place.name.toLowerCase() === 'home' ? <Home className="h-5 w-5 text-primary"/> : place.name.toLowerCase() === 'work' ? <Briefcase className="h-5 w-5 text-primary"/> : <Star className="h-5 w-5 text-primary"/>}
                                <div className="text-left">
                                    <p>{place.name}</p>
                                    <p className="text-xs text-muted-foreground font-normal truncate">{place.address}</p>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
                <Separator className="my-2"/>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto text-sm text-primary" onClick={() => setPopoverView('add_place')}>
                    <Plus className="h-4 w-4 mr-2"/> Add new place
                </Button>
            </div>
        )}
        {popoverView === 'add_place' && (
            <div className="p-4 space-y-4">
                 <Button variant="ghost" size="sm" onClick={() => setPopoverView('saved_places')} className="mb-2 px-1 h-auto"><ArrowLeft className="h-4 w-4 mr-2"/>Back to saved places</Button>
                 <div>
                    <Label htmlFor="place-name">Name (e.g., Home, Gym)</Label>
                    <Input id="place-name" value={newPlaceName} onChange={(e) => setNewPlaceName(e.target.value)} />
                 </div>
                 <div>
                    <Label htmlFor="place-address">Address</Label>
                    <Input id="place-address" value={newPlaceAddress} onChange={(e) => setNewPlaceAddress(e.target.value)} />
                 </div>
                 <Button onClick={handleAddNewPlace} className="w-full">Save Place</Button>
            </div>
        )}
      </PopoverContent>
    </Popover>
  );
}



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
                    {isLoaded && (
                        <>
                            <LocationInput
                                value={pickupLocation}
                                onLocationSelect={setPickupLocation}
                                placeholder="Pickup location"
                                mapRef={mapRef}
                            />
                            <LocationInput
                                value={dropoffLocation}
                                onLocationSelect={setDropoffLocation}
                                placeholder="Destination"
                                mapRef={mapRef}
                            />
                        </>
                    )}
                   
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
