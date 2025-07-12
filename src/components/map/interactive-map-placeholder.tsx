import { GoogleMap, useJsApiLoader, MarkerF as Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Map, MapPin } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';

interface InteractiveMapPlaceholderProps {
  pickup?: string;
  dropoff?: string;
  onMapLoad?: (map: google.maps.Map) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: ("places" | "maps" | "geocoding")[] = ['places', 'maps', 'geocoding'];

export default function InteractiveMapPlaceholder({ pickup, dropoff, onMapLoad }: InteractiveMapPlaceholderProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [pickupCoords, setPickupCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    const geocodeAddress = useCallback((address: string, setter: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>>) => {
        if (!window.google || !address) {
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
    }, []);

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
    
    const mapCenter = useMemo(() => {
        if (pickupCoords) return pickupCoords;
        if (dropoffCoords) return dropoffCoords;
        return { lat: 39.8283, lng: -98.5795 };
    }, [pickupCoords, dropoffCoords]);

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

        return (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={pickupCoords || dropoffCoords ? 12 : 4}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
                onLoad={map => {
                    if (onMapLoad) onMapLoad(map);
                }}
            >
                {pickupCoords && !dropoffCoords && <Marker position={pickupCoords} />}
                {!pickupCoords && dropoffCoords && <Marker position={dropoffCoords} />}
                
                {pickupCoords && dropoffCoords && (
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
                            suppressMarkers: false, // Set to false to show default A/B markers
                            polylineOptions: {
                                strokeColor: "#64B5F6", // RoamFree primary color
                                strokeWeight: 5,
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
                        <p>From: <strong>{pickup}</strong></p>
                        <p>To: <strong>{dropoff}</strong></p>
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
