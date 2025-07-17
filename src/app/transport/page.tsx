// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Clock, CalendarDays, LocateFixed, Compass, Star, Home, Briefcase, Plus, ArrowLeft, Building, Users, Check, ChevronsUpDown, Wand2, Map as MapIcon, Navigation, Trash2, UserPlus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import InteractiveMapPlaceholder, { type AvailableVehicle } from '@/components/map/interactive-map-placeholder';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useGoogleMaps } from '@/context/google-maps-provider';
import { getSavedPlacesAction, addSavedPlaceAction } from '@/app/actions';
import type { SavedPlace } from '@/services/places';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Switch } from '@/components/ui/switch';


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
      imageSrc: 'https://images.unsplash.com/photo-1589828155685-83225f7d91f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYXIlMjByb2FkfGVufDB8fHx8MTc1MjcyNzYwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      dataAiHint: 'car road',
      link: '#ride-booking',
    },
    {
      title: 'Reserve',
      description: 'Advance book a ride up to 30 days.',
      imageSrc: 'https://images.unsplash.com/photo-1614189839508-8261411697b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjYWxlbmRhciUyMGNhcnxlbnwwfHx8fDE3NTI3Mjc2MDd8MA&ixlib-rb-4.1.0&q=80&w=1080',
      dataAiHint: 'calendar car',
      link: '#ride-booking',
    },
    {
      title: 'Rental Cars',
      description: 'Rent a car from a variety of models.',
      imageSrc: 'https://images.unsplash.com/photo-1581966451257-a5c7c5afa833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxyZW50YWwlMjBjYXJzfGVufDB8fHx8MTc1MjcyNzYwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      dataAiHint: 'rental cars',
      link: '/car-rent',
    },
    {
      title: 'Courier',
      description: 'Send packages to friends and family.',
      imageSrc: 'https://images.unsplash.com/photo-1686632979221-62fab48a9028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxkZWxpdmVyeSUyMHBhY2thZ2V8ZW58MHx8fHwxNzUyNzI3NjA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      dataAiHint: 'delivery package',
      link: '/courier-delivery',
    },
    {
      title: 'Food',
      description: 'Get your favorite meals delivered.',
      imageSrc: 'https://images.unsplash.com/photo-1652862730749-31dae8981191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxmb29kJTIwZGVsaXZlcnl8ZW58MHx8fHwxNzUyNzI3NjA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      dataAiHint: 'food delivery',
      link: '#!', // Placeholder link
    },
    {
      title: 'Grocery',
      description: 'Have groceries delivered to your door.',
      imageSrc: 'https://images.unsplash.com/photo-1617500603321-bcd6286973b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxncm9jZXJ5JTIwYmFnfGVufDB8fHx8MTc1MjcyNzYwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      dataAiHint: 'grocery bag',
      link: '#!', // Placeholder link
    },
];


// LocationInput component using Popover and Command (cmdk)
interface LocationInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  iconType: 'pickup' | 'dropoff';
  onMapSelectRequest: () => void;
  onUseCurrentLocation: () => void;
}

function LocationInput({ value, onValueChange, placeholder, iconType, onMapSelectRequest, onUseCurrentLocation }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const { isLoaded } = useGoogleMaps();
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
  
  const handleSetOnMap = () => {
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
                <CommandItem onSelect={() => { onUseCurrentLocation(); setOpen(false); }} className="cursor-pointer">
                    <LocateFixed className="mr-2 h-4 w-4" /> Use Current Location
                </CommandItem>
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

// Mock data for available vehicles. In a real app, this would come from an API.
const mockVehicles: AvailableVehicle[] = [
    { id: 'car1', type: 'car', position: { lat: 34.0522, lng: -118.2437 } },
    { id: 'car2', type: 'car', position: { lat: 34.055, lng: -118.245 } },
    { id: 'mb1', type: 'motorbike', position: { lat: 34.050, lng: -118.248 } },
    { id: 'car3', type: 'car', position: { lat: 34.048, lng: -118.241 } },
    { id: 'mb2', type: 'motorbike', position: { lat: 34.056, lng: -118.239 } },
];


export default function TransportPage() {
    const router = useRouter();
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState('10:00');
    const [rideForSomeoneElse, setRideForSomeoneElse] = useState(false);
    const [riderName, setRiderName] = useState('');
    const [riderPhone, setRiderPhone] = useState('');
    const mapRef = useRef<google.maps.Map | null>(null);
    const { isLoaded } = useGoogleMaps();
    const mapClickListener = useRef<google.maps.MapsEventListener | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    const [showLocationPrompt, setShowLocationPrompt] = useState(false);
    const [fieldToSetFromLocation, setFieldToSetFromLocation] = useState<'pickup' | 'dropoff'>('pickup');

    useEffect(() => {
        setHasMounted(true);
    }, []);
    
    const geocodeCurrentPosition = useCallback((position: GeolocationPosition, field: 'pickup' | 'dropoff') => {
        if (!isLoaded) {
            toast({ title: 'Map not ready', description: 'Please wait for the map to load.', variant: 'destructive' });
            return;
        }
        const geocoder = new window.google.maps.Geocoder();
        const latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                if (field === 'pickup') {
                    setPickupLocation(address);
                } else {
                    setDropoffLocation(address);
                }
                toast({ title: "Location set!", description: "Your current location has been set." });
            } else {
                toast({ title: 'Error', description: 'Could not get address from your location.', variant: 'destructive' });
            }
        });
    }, [isLoaded]);

    const handleUseCurrentLocation = useCallback((field: 'pickup' | 'dropoff') => {
        setFieldToSetFromLocation(field);
        if (!navigator.geolocation) {
            toast({ title: 'Not Supported', description: 'Geolocation is not supported by your browser.', variant: 'destructive' });
            return;
        }

        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
            if (permissionStatus.state === 'granted') {
                navigator.geolocation.getCurrentPosition(
                    (pos) => geocodeCurrentPosition(pos, field), 
                    () => toast({ title: 'Error', description: 'Could not access your location.', variant: 'destructive' })
                );
            } else if (permissionStatus.state === 'prompt') {
                setShowLocationPrompt(true);
            } else if (permissionStatus.state === 'denied') {
                toast({ title: 'Permission Denied', description: 'Please enable location services in your browser settings.', variant: 'destructive' });
            }
        });
    }, [geocodeCurrentPosition]);
    
    // Auto-fetch location on load if permission is already granted
    useEffect(() => {
        if (isLoaded && hasMounted) {
            navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                if (permissionStatus.state === 'granted') {
                    // Automatically get location for pickup field without user click
                     navigator.geolocation.getCurrentPosition(
                        (pos) => geocodeCurrentPosition(pos, 'pickup'), 
                        () => console.error("Could not access location automatically.")
                    );
                }
            });
        }
    }, [isLoaded, hasMounted, geocodeCurrentPosition]);


    const proceedWithGeolocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => geocodeCurrentPosition(pos, fieldToSetFromLocation), 
            () => toast({ title: 'Permission Denied', description: 'Could not access your location.', variant: 'destructive' })
        );
    };


    const handleSearch = () => {
        if (!pickupLocation || !dropoffLocation) {
            toast({
                title: 'Missing Information',
                description: 'Please select both pickup and dropoff locations.',
                variant: 'destructive',
            });
            return;
        }

        if (rideForSomeoneElse && (!riderName || !riderPhone)) {
             toast({
                title: 'Missing Rider Information',
                description: "Please enter the rider's name and phone number.",
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

        if (rideForSomeoneElse) {
            query.set('forSomeoneElse', 'true');
            query.set('riderName', riderName);
            query.set('riderPhone', riderPhone);
        }

        router.push(`/transport/search?${query.toString()}`);
    };
    
    const setLocationFromMapClick = useCallback((latLng: google.maps.LatLng, field: 'pickup' | 'dropoff') => {
        if (!isLoaded) return;
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
    }, [isLoaded]);

    const setupMapClickListener = useCallback((fieldToSet: 'pickup' | 'dropoff') => {
        if (mapClickListener.current) {
            mapClickListener.current.remove();
        }
        if (mapRef.current) {
            toast({
              title: "Select on Map",
              description: "Please click a location on the map to set your pin.",
            });
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
    }, [setLocationFromMapClick]);

    const handleFromContacts = () => {
        toast({
            title: "Open Contacts (Demo)",
            description: "This would open your device's contact list to select a rider and auto-fill their details.",
        });
    };

  return (
    <div className="space-y-8">
       <Dialog open={showLocationPrompt} onOpenChange={setShowLocationPrompt}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Allow Location Access?</DialogTitle>
                    <DialogDescription>
                        To set your current location automatically, RoamFree needs access to your device's location. This helps us find nearby rides and provide accurate pickup services.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowLocationPrompt(false)}>No Thanks</Button>
                    <Button onClick={() => {
                        setShowLocationPrompt(false);
                        proceedWithGeolocation();
                    }}>Allow</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

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
            <div className="hidden lg:block rounded-lg overflow-hidden h-96 lg:h-[36rem] sticky top-24">
                <InteractiveMapPlaceholder 
                    pickup={pickupLocation} 
                    dropoff={dropoffLocation} 
                    setPickup={setPickupLocation}
                    setDropoff={setDropoffLocation}
                    onMapLoad={(map) => { mapRef.current = map; }}
                    availableVehicles={mockVehicles}
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
                            iconType="pickup"
                            onMapSelectRequest={() => setupMapClickListener('pickup')}
                            onUseCurrentLocation={() => handleUseCurrentLocation('pickup')}
                        />
                        <LocationInput
                            value={dropoffLocation}
                            onValueChange={setDropoffLocation}
                            placeholder="Destination"
                            iconType="dropoff"
                             onMapSelectRequest={() => setupMapClickListener('dropoff')}
                             onUseCurrentLocation={() => handleUseCurrentLocation('dropoff')}
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
                <div className="flex items-center space-x-2 pt-2">
                    <Switch id="ride-for-other" checked={rideForSomeoneElse} onCheckedChange={setRideForSomeoneElse} />
                    <Label htmlFor="ride-for-other" className="flex items-center gap-2"><UserPlus className="h-4 w-4" />Ride for someone else</Label>
                </div>

                {rideForSomeoneElse && (
                    <div className="space-y-4 pt-4 border-t mt-4 animate-in fade-in-0 duration-300">
                        <h4 className="font-semibold text-foreground">Rider's Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <Label htmlFor="riderName">Rider's Name</Label>
                                    <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleFromContacts}>From Contacts</Button>
                                </div>
                                <Input id="riderName" placeholder="e.g., Jane Doe" value={riderName} onChange={(e) => setRiderName(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="riderPhone">Rider's Phone Number</Label>
                                <Input id="riderPhone" type="tel" placeholder="e.g., +1 555-123-4567" value={riderPhone} onChange={(e) => setRiderPhone(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
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
       
      <Card className="relative overflow-hidden group rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <Image 
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHx0cmF2ZWwlMjBtb3VudGFpbnN8ZW58MHx8fHwxNzUyODE0MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Trip Planner background"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          data-ai-hint="travel mountains"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative p-6 md:p-8 text-white">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-2xl md:text-3xl font-headline text-white flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-yellow-300" />
              Plan smarter with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="mb-4 max-w-lg">
              Our AI Trip Planner can build a custom itinerary for you, including transport, stays, and activities.
            </p>
          </CardContent>
          <CardFooter className="p-0">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm hover:shadow-md transition-shadow" asChild>
              <Link href="/ai-trip-planner">Start Planning</Link>
            </Button>
          </CardFooter>
        </div>
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
