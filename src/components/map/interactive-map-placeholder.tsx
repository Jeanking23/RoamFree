
import { GoogleMap, MarkerF as Marker, DirectionsService, DirectionsRenderer, InfoWindowF as InfoWindow } from '@react-google-maps/api';
import { Map, MapPin } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useGoogleMaps } from '@/context/google-maps-provider';

interface InteractiveMapPlaceholderProps {
  pickup?: string;
  dropoff?: string;
  onMapLoad?: (map: google.maps.Map) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const customMapStyle = [
  {
    "featureType": "poi",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
];

export default function InteractiveMapPlaceholder({ pickup, dropoff, onMapLoad }: InteractiveMapPlaceholderProps) {
    const { isLoaded, loadError } = useGoogleMaps();

    const [pickupCoords, setPickupCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [activeInfoWindow, setActiveInfoWindow] = useState<'pickup' | 'dropoff' | null>(null);


    const geocodeAddress = useCallback((address: string, setter: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>>) => {
        if (!isLoaded || !address) {
            setter(null);
            return;
        }
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                setter({
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                });
            } else {
                console.error(`Geocode was not successful for the following reason: ${status}`);
                setter(null);
            }
        });
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded && pickup) {
            geocodeAddress(pickup, setPickupCoords);
        } else {
            setPickupCoords(null);
        }
    }, [pickup, isLoaded, geocodeAddress]);

    useEffect(() => {
        if (isLoaded && dropoff) {
            geocodeAddress(dropoff, setDropoffCoords);
        } else {
            setDropoffCoords(null);
        }
    }, [dropoff, isLoaded, geocodeAddress]);
    
    useEffect(() => {
        if (!pickupCoords || !dropoffCoords) {
            setDirections(null);
        }
    }, [pickupCoords, dropoffCoords]);

    const mapCenter = useMemo(() => {
        if (pickupCoords) return pickupCoords;
        if (dropoffCoords) return dropoffCoords;
        return { lat: 39.8283, lng: -98.5795 };
    }, [pickupCoords, dropoffCoords]);
    
    const onLoad = useCallback((map: google.maps.Map) => {
        if(onMapLoad) onMapLoad(map);
    }, [onMapLoad]);

    const handleDirectionsResponse = (
        response: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
    ) => {
        if (status === 'OK' && response) {
            setDirections(response);
        } else {
            console.error(`Directions request failed due to ${status}`);
        }
    };
    

    const renderMap = () => {
        if (loadError) {
            return <div>Error loading map</div>;
        }

        if (!isLoaded) {
            return <div>Loading map...</div>;
        }
        
        // Custom SVG icons for markers
        const pickupIcon = {
            url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="hsl(217 91% 60%)" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3" fill="white"></circle></svg>`,
            scaledSize: new window.google.maps.Size(32, 32),
        };
        const dropoffIcon = {
            url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="hsl(217 33% 17%)" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`,
            scaledSize: new window.google.maps.Size(32, 32),
        };


        return (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={pickupCoords || dropoffCoords ? 12 : 4}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: customMapStyle,
                }}
                onLoad={onLoad}
            >
                {pickupCoords && (
                    <Marker position={pickupCoords} icon={pickupIcon} animation={window.google.maps.Animation.DROP} onClick={() => setActiveInfoWindow('pickup')}>
                        {activeInfoWindow === 'pickup' && pickup && (
                             <InfoWindow position={pickupCoords} onCloseClick={() => setActiveInfoWindow(null)}>
                                <div className="p-1 font-sans">
                                    <h4 className="font-bold text-sm text-primary">Pickup</h4>
                                    <p className="text-xs text-foreground">{pickup}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                )}

                {dropoffCoords && (
                    <Marker position={dropoffCoords} icon={dropoffIcon} animation={window.google.maps.Animation.DROP} onClick={() => setActiveInfoWindow('dropoff')}>
                       {activeInfoWindow === 'dropoff' && dropoff && (
                             <InfoWindow position={dropoffCoords} onCloseClick={() => setActiveInfoWindow(null)}>
                                <div className="p-1 font-sans">
                                    <h4 className="font-bold text-sm text-foreground">Destination</h4>
                                    <p className="text-xs text-muted-foreground">{dropoff}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                )}
                
                {pickupCoords && dropoffCoords && !directions && (
                    <DirectionsService
                        options={{
                            destination: dropoffCoords,
                            origin: pickupCoords,
                            travelMode: google.maps.TravelMode.DRIVING,
                        }}
                        callback={handleDirectionsResponse}
                    />
                )}
                
                {directions && (
                     <DirectionsRenderer
                        options={{
                            directions,
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: "#2563EB", // Tailwind's blue-600
                                strokeWeight: 6,
                                strokeOpacity: 0.8,
                            },
                        }}
                    />
                )}

            </GoogleMap>
        );
    };

    return (
        <div className="bg-card shadow-lg rounded-lg border overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b">
                <h3 className="text-lg font-headline font-semibold text-primary flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Live Route
                </h3>
                {pickup && dropoff ? (
                    <div className="text-xs text-muted-foreground mt-1">
                        <p className="truncate">From: <strong>{pickup}</strong></p>
                        <p className="truncate">To: <strong>{dropoff}</strong></p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                        Enter pickup and dropoff to see the route.
                    </p>
                )}
            </div>
            <div className="flex-grow bg-muted flex items-center justify-center relative">
                {renderMap()}
            </div>
        </div>
    );
}
