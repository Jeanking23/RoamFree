
// src/app/transport/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car, Bus, CarFront, Plane, MapPin, Search, Clock, CalendarDays, LocateFixed, Compass, Star, Home, Briefcase, Plus, ArrowLeft, Building, Users, Check, ChevronsUpDown, Wand2, Map as MapIcon, Navigation, Trash2, UserPlus, Sparkles, MessageSquare, Repeat } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusTransportationSearchForm from '../transport/bus-transportation-search-form';


const serviceCategories = [
  { name: 'Ride', icon: Car, link: '/transport?tab=ride', tabValue: 'ride' },
  { name: 'Bus', icon: Bus, link: '/transport?tab=bus', tabValue: 'bus' },
  { name: 'Rent', icon: CarFront, link: '/car-rent', tabValue: 'rent' },
  { name: 'Flights', icon: Plane, link: '/flights', tabValue: 'flights' },
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
      imageSrc: 'https://images.unsplash.com/photo-1614189839508-8261411697b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjYWxlbmRhciUyMGNhcnxlbnwwfHx8fDE3NTI3Mjc2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
  map: google.maps.Map | null;
}

function LocationInput({ value, onValueChange, placeholder, iconType, onMapSelectRequest, onUseCurrentLocation, map }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<google.maps.places.Place[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const { isLoaded } = useGoogleMaps();

  // For adding a new saved place
  const [isAddPlaceDialogOpen, setIsAddPlaceDialogOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceAddress, setNewPlaceAddress] = useState("");

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

  const handleInputChange = async (term: string) => {
    setInputValue(term);
    if (isLoaded && term && map) {
      try {
        const request = {
          textQuery: term,
          fields: ['displayName', 'formattedAddress', 'id'],
          locationBias: map.getBounds()!,
        };
        const { places } = await google.maps.places.Place.searchByText(request);
        setSuggestions(places || []);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      }
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
                <CommandItem onSelect={() => { onUseCurrentLocation(); setOpen(false); }}>
                    <LocateFixed className="mr-2 h-4 w-4" /> Use Current Location
                </CommandItem>
                <CommandItem onSelect={handleSetOnMap}>
                    <MapIcon className="mr-2 h-4 w-4" /> Set location on map
                </CommandItem>
            </CommandGroup>
            
            {savedPlaces.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Saved Places">
              {savedPlaces.map((place) => (
                <CommandItem
                  key={place.id}
                  onSelect={() => handleSelect(place.address)}
                  className="group"
                >
                  <Star className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-amber-400" />
                  <span className="group-hover:text-foreground">{place.name}</span>
                </CommandItem>
              ))}
                <CommandItem onSelect={() => setIsAddPlaceDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add new place
                </CommandItem>
            </CommandGroup>

            {suggestions.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Suggestions">
              {suggestions.map((prediction) => (
                <CommandItem
                  key={prediction.id}
                  onSelect={() => handleSelect(prediction.formattedAddress || prediction.displayName || '')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {prediction.displayName}
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
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('ride');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState('10:00');
    const [rideForSomeoneElse, setRideForSomeoneElse] = useState(false);
    const [riderName, setRiderName] = useState('');
    const [riderPhone, setRiderPhone] = useState('');
    const mapRef = useRef<google.maps.Map | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const { isLoaded } = useGoogleMaps();
    const mapClickListener = useRef<google.maps.MapsEventListener | null>(null);
    const [hasMounted, setHasMounted] = useState(false);
    
    // New state for added fields
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [returnDate, setReturnDate] = useState<Date | undefined>();
    const [returnTime, setReturnTime] = useState('10:00');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [comment, setComment] = useState('');

    const [showLocationPrompt, setShowLocationPrompt] = useState(false);
    const [fieldToSetFromLocation, setFieldToSetFromLocation] = useState<'pickup' | 'dropoff'>('pickup');
    
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['ride', 'bus', 'rent', 'flights'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        setHasMounted(true);
        setDate(new Date());
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
            adults: adults.toString(),
            children: children.toString(),
        });

        if (comment) query.set('comment', comment);
        if (isRoundTrip && returnDate) {
            query.set('returnDate', returnDate.toISOString());
            query.set('returnTime', returnTime);
        }

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

    const handleFromContacts = async () => {
        if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
            try {
                const contacts = await (navigator as any).contacts.select(['name', 'tel'], { multiple: false });
                if (contacts.length > 0) {
                    const contact = contacts[0];
                    if (contact.name && contact.name.length > 0) {
                        setRiderName(contact.name[0]);
                    }
                    if (contact.tel && contact.tel.length > 0) {
                        setRiderPhone(contact.tel[0]);
                    }
                    toast({ title: "Contact Selected", description: "Rider details have been filled in." });
                }
            } catch (ex) {
                toast({
                    title: "Could Not Access Contacts",
                    description: "There was an error accessing your contacts. Please ensure you have granted permission.",
                    variant: "destructive"
                });
            }
        } else {
            toast({
                title: "Feature Not Supported",
                description: "Your browser does not support the Contact Picker API.",
                variant: "default",
            });
        }
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
            Your one-stop solution for getting around.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="h-96 md:h-full min-h-[400px]">
                <InteractiveMapPlaceholder 
                    pickup={pickupLocation} 
                    dropoff={dropoffLocation} 
                    setPickup={setPickupLocation}
                    setDropoff={setDropoffLocation}
                    onMapLoad={(map) => { 
                        mapRef.current = map;
                        setMap(map);
                    }}
                    availableVehicles={mockVehicles}
                />
            </div>
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-14">
                  {serviceCategories.map((service) => (
                    <TabsTrigger key={service.tabValue} value={service.tabValue} className="text-base py-3">
                      <span className="flex flex-col md:flex-row items-center gap-2">
                          <service.icon className={cn("h-6 w-6")} />
                          <span className="hidden md:inline">{service.name}</span>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="ride">
                  <Card id="ride-booking">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="text-lg font-semibold">Book a Ride</h3>
                      <div className="space-y-1">
                        <div className="relative">
                            <div className="absolute left-2.5 top-[18px] h-[calc(100%-36px)] w-px bg-muted-foreground/30"></div>
                            <div className="space-y-1">
                                <LocationInput
                                    value={pickupLocation}
                                    onValueChange={setPickupLocation}
                                    placeholder="Pickup location"
                                    iconType="pickup"
                                    onMapSelectRequest={() => setupMapClickListener('pickup')}
                                    onUseCurrentLocation={() => handleUseCurrentLocation('pickup')}
                                    map={map}
                                />
                                <LocationInput
                                    value={dropoffLocation}
                                    onValueChange={setDropoffLocation}
                                    placeholder="Destination"
                                    iconType="dropoff"
                                    onMapSelectRequest={() => setupMapClickListener('dropoff')}
                                    onUseCurrentLocation={() => handleUseCurrentLocation('dropoff')}
                                    map={map}
                                />
                            </div>
                        </div>

                        <div className="px-1">
                            <div className="flex items-center space-x-2">
                                <Switch id="round-trip" checked={isRoundTrip} onCheckedChange={setIsRoundTrip} />
                                <Label htmlFor="round-trip" className="flex items-center gap-2 text-sm">
                                    <span className="flex items-center gap-2"><Repeat className="h-4 w-4" />Round Trip / Return Way</span>
                                </Label>
                            </div>
                        </div>
                        
                        <AnimatePresence>
                        {isRoundTrip && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 gap-2 pt-2 overflow-hidden border-t px-1"
                            >
                                <div>
                                    <Label className="text-xs">Return Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button size="sm" variant={"outline"} className={cn("w-full justify-start text-left font-normal",!returnDate && "text-muted-foreground")}>
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} disabled={(d) => d < (date || new Date(new Date().setHours(0,0,0,0)))} initialFocus/>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label className="text-xs">Return Time</Label>
                                    <Input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>


                        <div className="grid grid-cols-2 gap-2 px-1">
                            <div>
                                <Label className="text-xs">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="sm"
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
                                <Label className="text-xs">Time</Label>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="px-1">
                            <Label className="text-xs">Passengers</Label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Label htmlFor="adults" className="text-xs text-muted-foreground">Adults</Label>
                                    <Input id="adults" type="number" min="1" value={adults} onChange={e => setAdults(Number(e.target.value))} />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="children" className="text-xs text-muted-foreground">Children</Label>
                                    <Input id="children" type="number" min="0" value={children} onChange={e => setChildren(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>

                        <div className="px-1">
                            <Label htmlFor="comment" className="flex items-center gap-2 text-xs">
                                <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/>Comment (Optional)</span>
                            </Label>
                            <Textarea 
                                id="comment"
                                placeholder="Luggage info, special needs..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                className="text-sm"
                            />
                        </div>

                        <div className="flex items-center space-x-2 px-1">
                            <Switch id="ride-for-other" checked={rideForSomeoneElse} onCheckedChange={setRideForSomeoneElse} />
                            <Label htmlFor="ride-for-other" className="flex items-center gap-2 text-sm">
                                <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" />Ride for someone else</span>
                            </Label>
                        </div>

                        <AnimatePresence>
                            {rideForSomeoneElse && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="space-y-3 pt-3 border-t overflow-hidden p-3 border rounded-md"
                                >
                                    <h4 className="font-semibold text-foreground text-sm">Rider's Details</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <Label htmlFor="riderName" className="text-xs">Rider's Name</Label>
                                                <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={handleFromContacts}>From Contacts</Button>
                                            </div>
                                            <Input id="riderName" placeholder="e.g., Jane Doe" value={riderName} onChange={(e) => setRiderName(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor="riderPhone" className="text-xs">Rider's Phone</Label>
                                            <Input id="riderPhone" type="tel" placeholder="+1 555-123-4567" value={riderPhone} onChange={(e) => setRiderPhone(e.target.value)} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-1">
                          <Button className="w-full" onClick={handleSearch}>
                            <span className="flex items-center gap-2">
                              <Search className="h-4 w-4" />
                              Search Rides
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="bus">
                  <Card>
                    <CardContent className="p-4">
                      <BusTransportationSearchForm />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="rent">
                  <Card className="text-center p-6">
                    <CardTitle>Looking for a Rental?</CardTitle>
                    <CardDescription>Browse our wide selection of rental cars.</CardDescription>
                    <Button asChild className="mt-4">
                        <Link href="/car-rent">Go to Car Rentals</Link>
                    </Button>
                  </Card>
                </TabsContent>
                <TabsContent value="flights">
                   <Card className="text-center p-6">
                    <CardTitle>Ready to Fly?</CardTitle>
                    <CardDescription>Find the best deals on flights.</CardDescription>
                    <Button asChild className="mt-4">
                        <Link href="/flights">Search Flights</Link>
                    </Button>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="container mx-auto px-4 space-y-8">
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
    </div>
  );
}
