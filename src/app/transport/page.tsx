
// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Bike, Shield, ShoppingBag, Utensils, Star, LocateFixed, Clock, CalendarDays, CircleDot, Square, Users, Package, Wand2, Home as HomeIcon, Briefcase, History, Check, CalendarCheck, Map, ArrowLeft } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { getSavedPlacesAction, addSavedPlaceAction } from '@/app/actions';
import type { SavedPlace } from '@/services/places';

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
  icon: React.ReactNode;
  onSetLocationOnMap: () => void;
}

const LocationInput = ({
    value,
    onValueChange,
    placeholder,
    icon,
    onSetLocationOnMap
}: LocationInputProps) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });
    
    const [open, setOpen] = useState(false);
    const [popoverView, setPopoverView] = useState<'main' | 'saved' | 'add'>('main');
    const [newPlaceName, setNewPlaceName] = useState('');
    const [newPlaceAddress, setNewPlaceAddress] = useState('');
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
    
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchSavedPlaces = useCallback(async () => {
        setIsLoadingPlaces(true);
        const result = await getSavedPlacesAction();
        if ("error" in result) {
            toast({ title: 'Error fetching saved places', description: result.error, variant: 'destructive' });
            setSavedPlaces([]);
        } else {
            const placesWithIcons = result.map(p => ({
                ...p,
                icon: p.name.toLowerCase() === 'home' ? HomeIcon : p.name.toLowerCase() === 'work' ? Briefcase : MapPin,
            }));
            setSavedPlaces(placesWithIcons);
        }
        setIsLoadingPlaces(false);
    }, []);

    useEffect(() => {
      if (popoverView === 'saved' && open) {
        fetchSavedPlaces();
      }
    }, [popoverView, open, fetchSavedPlaces]);

    const handleAddNewPlace = async () => {
        if (!newPlaceName || !newPlaceAddress) {
            toast({ title: 'Missing Information', description: 'Please provide a name and address.', variant: 'destructive' });
            return;
        }
        const result = await addSavedPlaceAction({ name: newPlaceName, address: newPlaceAddress });
        if ("error" in result) {
            toast({ title: 'Error saving place', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Place Added', description: `${newPlaceName} has been saved.` });
            setNewPlaceName('');
            setNewPlaceAddress('');
            setPopoverView('saved');
        }
    };
    
    const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) {
                onValueChange(place.formatted_address);
                setOpen(false); // Close popover on selection
            }
        }
    };


    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (!window.google) {
                        toast({ title: "Map not ready", description: "Google Maps script is still loading.", variant: "destructive" });
                        return;
                    }
                    const geocoder = new window.google.maps.Geocoder();
                    const latLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    geocoder.geocode({ location: latLng }, (results, status) => {
                        if (status === "OK") {
                            if (results && results[0]) {
                                onValueChange(results[0].formatted_address);
                                toast({ title: "Location Updated", description: "Location set to your current address." });
                                setOpen(false);
                            } else {
                                toast({ title: "Error", description: "No results found for your location.", variant: "destructive" });
                            }
                        } else {
                            toast({ title: "Geocoder Error", description: `Geocoder failed due to: ${status}`, variant: "destructive" });
                        }
                    });
                },
                (error) => {
                    toast({ title: "Geolocation Error", description: `Error: ${error.message}`, variant: "destructive" });
                }
            );
        } else {
             toast({ title: "Geolocation not supported", description: "Your browser does not support geolocation.", variant: "destructive" });
        }
    };
    
    const handleSelectSavedPlace = (placeAddress: string) => {
        onValueChange(placeAddress);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if(!isOpen) setPopoverView('main')}}>
            <PopoverTrigger asChild>
                 <Button variant="outline" className="w-full justify-start text-left font-normal h-auto py-2.5">
                    <div className="flex items-start gap-3">
                        {icon}
                        <div className="flex-grow">
                            <p className="text-xs text-muted-foreground">{placeholder}</p>
                            <p className={cn("text-sm text-foreground truncate", !value && "text-muted-foreground/80")}>
                                {value || placeholder}
                            </p>
                        </div>
                    </div>
                 </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                 {popoverView === 'main' && (
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={() => setPopoverView('saved')}>
                            <Star className="h-5 w-5 bg-muted text-muted-foreground p-1 rounded-full" />
                            <div>
                                <p className="font-semibold text-sm">Saved places</p>
                            </div>
                        </Button>
                        <Separator />
                        <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={handleUseCurrentLocation}>
                            <LocateFixed className="h-5 w-5 bg-primary text-primary-foreground p-1 rounded-full" />
                            <div>
                                <p className="font-semibold text-sm">Allow location access</p>
                                <p className="text-xs text-muted-foreground text-left">It provides your pickup address</p>
                            </div>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={()=>{onSetLocationOnMap(); setOpen(false);}}>
                            <MapPin className="h-5 w-5 bg-muted text-muted-foreground p-1 rounded-full" />
                            <div>
                                <p className="font-semibold text-sm">Set location on map</p>
                            </div>
                        </Button>
                        <Separator/>
                         {isLoaded ? (
                            <Autocomplete
                                onLoad={onAutocompleteLoad}
                                onPlaceChanged={onPlaceChanged}
                                options={{ fields: ["formatted_address", "geometry", "name"], types: ["address"] }}
                            >
                                <Input
                                    ref={inputRef}
                                    placeholder={placeholder}
                                    className="w-full"
                                    defaultValue={value}
                                />
                            </Autocomplete>
                        ) : (
                            <Input placeholder="Loading map..." className="w-full" disabled />
                        )}
                    </div>
                 )}
                 {popoverView === 'saved' && (
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-auto text-sm mb-1" onClick={() => setPopoverView('main')}>
                            <ArrowLeft className="h-4 w-4 mr-1"/> Back to options
                        </Button>
                        <Separator />
                        {isLoadingPlaces && <p className="text-sm text-muted-foreground p-2">Loading saved places...</p>}
                        {!isLoadingPlaces && savedPlaces.map((place) => (
                           <Button key={place.id} variant="ghost" className="w-full justify-start gap-3 h-auto" onClick={() => handleSelectSavedPlace(place.address)}>
                                <place.icon className="h-5 w-5 bg-muted text-muted-foreground p-1 rounded-full" />
                                <div>
                                    <p className="font-semibold text-sm text-left">{place.name}</p>
                                    <p className="text-xs text-muted-foreground text-left">{place.address}</p>
                                </div>
                            </Button>
                        ))}
                         {!isLoadingPlaces && savedPlaces.length === 0 && (
                            <p className="text-sm text-muted-foreground p-2 text-center">No saved places yet.</p>
                        )}
                        <Separator />
                         <Button variant="ghost" className="w-full justify-start gap-3 h-auto text-sm text-primary" onClick={() => setPopoverView('add')}>
                            + Add new place
                        </Button>
                    </div>
                 )}
                 {popoverView === 'add' && (
                    <div className="space-y-2">
                         <Button variant="ghost" className="w-full justify-start gap-3 h-auto text-sm mb-1" onClick={() => setPopoverView('saved')}>
                            <ArrowLeft className="h-4 w-4 mr-1"/> Back to Saved Places
                        </Button>
                        <Separator />
                        <div className="p-2 space-y-3">
                            <h4 className="font-semibold text-sm">Add a new place</h4>
                             <Input 
                                placeholder="Name (e.g., Gym)" 
                                value={newPlaceName}
                                onChange={(e) => setNewPlaceName(e.target.value)}
                            />
                             <Input 
                                placeholder="Address" 
                                value={newPlaceAddress}
                                onChange={(e) => setNewPlaceAddress(e.target.value)}
                            />
                            <Button className="w-full" size="sm" onClick={handleAddNewPlace}>Save Place</Button>
                        </div>
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
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

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
    
    const setLocationFromMap = (setter: (address: string) => void) => {
        if (!mapInstance) {
            toast({ title: "Map not ready", description: "The map is still initializing.", variant: "destructive"});
            return;
        }
        if (!window.google) {
            toast({ title: "Map not ready", description: "Google Maps script is still loading.", variant: "destructive" });
            return;
        }
        const center = mapInstance.getCenter();
        if (!center) {
            toast({ title: "Map center not available", variant: "destructive"});
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: center }, (results, status) => {
            if (status === "OK") {
                if (results && results[0]) {
                    setter(results[0].formatted_address);
                    toast({ title: "Location Updated", description: "Location set from map center." });
                } else {
                    toast({ title: "Error", description: "No results found for this map location.", variant: "destructive" });
                }
            } else {
                toast({ title: "Geocoder Error", description: `Geocoder failed due to: ${status}`, variant: "destructive" });
            }
        });
    }


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
                <InteractiveMapPlaceholder pickup={pickupLocation} dropoff={dropoffLocation} onMapLoad={setMapInstance}/>
            </div>

            <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Book a Ride</h3>
                <div className="space-y-4">
                     <LocationInput
                        value={pickupLocation}
                        onValueChange={setPickupLocation}
                        placeholder="Pickup location"
                        icon={<CircleDot className="h-4 w-4 text-muted-foreground mt-0.5" />}
                        onSetLocationOnMap={() => setLocationFromMap(setPickupLocation)}
                    />
                    <LocationInput
                        value={dropoffLocation}
                        onValueChange={setDropoffLocation}
                        placeholder="Destination"
                        icon={<Square className="h-4 w-4 text-muted-foreground mt-0.5" />}
                        onSetLocationOnMap={() => setLocationFromMap(setDropoffLocation)}
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
                                <p className="text-xs p-2 text-muted-foreground">Press Escape to close.</p>
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
