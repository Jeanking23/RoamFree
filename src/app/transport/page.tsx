
// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Clock, CalendarDays, LocateFixed, Compass, Star, Home, Briefcase, Plus, ArrowLeft, Building, Users, Check, ChevronsUpDown, Wand2, Map as MapIcon, Navigation, Trash2 } from 'lucide-react';
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
import { useGoogleMaps } from '@/context/google-maps-provider';
import { getSavedPlacesAction, addSavedPlaceAction } from '@/app/actions';
import type { SavedPlace } from '@/services/places';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";


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


// LocationInput component using Popover and Command (cmdk)
interface LocationInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  isLoaded: boolean;
  iconType: 'pickup' | 'dropoff';
  onMapSelectRequest: () => google.maps.MapsEventListener | null;
}

function LocationInput({ value, onValueChange, placeholder, isLoaded, iconType, onMapSelectRequest }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  // For adding a new saved place
  const [isAddPlaceDialogOpen, setIsAddPlaceDialogOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceAddress, setNewPlaceAddress] = useState("");


  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

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

  useEffect(() => {
    if (open) {
      fetchPlaces();
    }
  }, [open, fetchPlaces]);

  const handleInputChange = (term: string) => {
    setInputValue(term);
    if (autocompleteService.current && term) {
      autocompleteService.current.getPlacePredictions({ input: term }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setInputValue(selectedValue);
    setOpen(false);
    setSuggestions([]);
  };
  
  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Not Supported', description: 'Geolocation is not supported by your browser.', variant: 'destructive' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            handleSelect(results[0].formatted_address);
            toast({ title: "Location set!", description: "Your current location has been set as the address." });
          } else {
            toast({ title: 'Error', description: 'Could not get address from your location.', variant: 'destructive' });
          }
        });
      },
      () => {
        toast({ title: 'Permission Denied', description: 'Could not access your location.', variant: 'destructive' });
      }
    );
  };
  
  const handleSetOnMap = () => {
    toast({
      title: "Select on Map",
      description: "Please click a location on the map to set your pin.",
    });
    setOpen(false);
    onMapSelectRequest();
  };
  
  const handleAddNewPlace = async () => {
    if (!newPlaceName || !newPlaceAddress) {
        toast({ title: "Missing Information", description: "Please provide a name and address.", variant: "destructive" });
        return;
    }
    const result = await addSavedPlaceAction({ name: newPlaceName, address: newPlaceAddress });
    if ('error' in result) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
        toast({ title: "Success", description: `Saved "${newPlaceName}" to your places.` });
        setIsAddPlaceDialogOpen(false);
        setNewPlaceName("");
        setNewPlaceAddress("");
        fetchPlaces(); // Refresh the list
    }
  };

  const icon = iconType === 'pickup' 
    ? <div className="w-2.5 h-2.5 bg-foreground rounded-full" />
    : <div className="w-2.5 h-2.5 bg-foreground" />;

  return (
    <>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start h-auto py-3 px-4 text-left font-normal"
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className={cn("truncate", !value && "text-muted-foreground")}>
                    {value || placeholder}
                </span>
            </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>{isLoadingPlaces ? 'Loading places...' : 'No results found.'}</CommandEmpty>
             <CommandGroup>
                <Popover>
                    <PopoverTrigger asChild>
                        <CommandItem className="cursor-pointer">
                            <Star className="mr-2 h-4 w-4" />
                            <span>Saved places</span>
                        </CommandItem>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search saved places..." />
                            <CommandList>
                                <CommandEmpty>No saved places found.</CommandEmpty>
                                <CommandGroup>
                                    {savedPlaces.map((place) => (
                                    <CommandItem key={place.id} onSelect={() => handleSelect(place.address)} className="cursor-pointer">
                                        <Home className="mr-2 h-4 w-4" />{place.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem onSelect={() => setIsAddPlaceDialogOpen(true)} className="cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4" /> Add new place
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <CommandItem onSelect={handleAllowLocation} className="cursor-pointer">
                    <LocateFixed className="mr-2 h-4 w-4" /> Allow location access
                </CommandItem>
                <CommandItem onSelect={handleSetOnMap} className="cursor-pointer">
                    <MapIcon className="mr-2 h-4 w-4" /> Set location on map
                </CommandItem>
            </CommandGroup>
            
            {suggestions.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Suggestions">
              {suggestions.map((prediction) => (
                <CommandItem
                  key={prediction.place_id}
                  onSelect={() => handleSelect(prediction.description)}
                  className="cursor-pointer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {prediction.description}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
     <Dialog open={isAddPlaceDialogOpen} onOpenChange={setIsAddPlaceDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add a New Saved Place</DialogTitle>
                <DialogDescription>Save an address for quick access later.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="placeName">Name</Label>
                    <Input id="placeName" placeholder="e.g., Home, Work" value={newPlaceName} onChange={(e) => setNewPlaceName(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="placeAddress">Address</Label>
                    <Input id="placeAddress" placeholder="Enter the full address" value={newPlaceAddress} onChange={(e) => setNewPlaceAddress(e.target.value)} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="button" onClick={handleAddNewPlace}>Save Place</Button>
            </DialogFooter>
        </DialogContent>
     </Dialog>
    </>
  );
}


export default function TransportPage() {
    const router = useRouter();
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState('10:00');
    const mapRef = useRef<google.maps.Map | null>(null);
    const { isLoaded } = useGoogleMaps();
    const mapClickListener = useRef<google.maps.MapsEventListener | null>(null);

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
            date: date ? date.toISOString() : new Date().toISOString(),
            time: time,
        });

        router.push(`/transport/search?${query.toString()}`);
    };
    
    const setLocationFromMapClick = useCallback((latLng: google.maps.LatLng, field: 'pickup' | 'dropoff') => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                if (field === 'pickup') {
                    setPickupLocation(address);
                } else {
                    setDropoffLocation(address);
                }
                toast({ title: "Location Set", description: `Set ${field} location from map.` });
            } else {
                toast({ title: 'Error', description: 'Could not get address from map location.', variant: 'destructive' });
            }
        });
    }, []);

    const setupMapClickListener = useCallback((fieldToSet: 'pickup' | 'dropoff') => {
        if (mapClickListener.current) {
            mapClickListener.current.remove();
        }
        if (mapRef.current) {
            mapClickListener.current = mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                    setLocationFromMapClick(e.latLng, fieldToSet);
                }
                if (mapClickListener.current) {
                    mapClickListener.current.remove();
                    mapClickListener.current = null;
                }
            });
        }
        return mapClickListener.current;
    }, [setLocationFromMapClick]);


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
                <div className="relative">
                    <div className="absolute left-[23px] top-[18px] h-[calc(100%-36px)] w-px bg-muted-foreground"></div>
                    <div className="space-y-2">
                        <LocationInput
                            value={pickupLocation}
                            onValueChange={setPickupLocation}
                            placeholder="Pickup location"
                            isLoaded={isLoaded}
                            iconType="pickup"
                            onMapSelectRequest={() => setupMapClickListener('pickup')}
                        />
                        <LocationInput
                            value={dropoffLocation}
                            onValueChange={setDropoffLocation}
                            placeholder="Destination"
                            isLoaded={isLoaded}
                            iconType="dropoff"
                             onMapSelectRequest={() => setupMapClickListener('dropoff')}
                        />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                         <Label>Time</Label>
                         <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="w-full" onClick={handleSearch}>
                        Search Rides
                    </Button>
                    <Button variant="secondary" onClick={handleSearch} className="flex-shrink-0">
                         <Navigation className="h-5 w-5" />
                    </Button>
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
