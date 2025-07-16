
import { GoogleMap, MarkerF as Marker, DirectionsService, DirectionsRenderer, InfoWindowF as InfoWindow } from '@react-google-maps/api';
import { Map } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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

export default function InteractiveMapPlaceholder({ pickup, dropoff, onMapLoad }: InteractiveMapPlaceholderProps) {
    const { isLoaded, loadError } = useGoogleMaps();

    const [pickupCoords, setPickupCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [activeInfoWindow, setActiveInfoWindow] = useState<'pickup' | 'dropoff' | null>(null);
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 39.8283, lng: -98.5795 });
    const [zoom, setZoom] = useState(4);
    const mapRef = useRef<google.maps.Map | null>(null);

    const geocodeAddress = useCallback((
        address: string, 
        setter: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>>,
        infoWindowSetter: 'pickup' | 'dropoff'
    ) => {
        if (!isLoaded || !address) {
            setter(null);
            return;
        }
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const newCoords = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                };
                setter(newCoords);
                setMapCenter(newCoords);
                setZoom(16); // Set a closer zoom level for a single address
                setActiveInfoWindow(infoWindowSetter); // Show InfoWindow by default
            } else {
                console.error(`Geocode was not successful for the following reason: ${status}`);
                setter(null);
            }
        });
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded && pickup) {
            geocodeAddress(pickup, setPickupCoords, 'pickup');
        } else {
            setPickupCoords(null);
        }
    }, [pickup, isLoaded, geocodeAddress]);

    useEffect(() => {
        if (isLoaded && dropoff) {
            geocodeAddress(dropoff, setDropoffCoords, 'dropoff');
        } else {
            setDropoffCoords(null);
        }
    }, [dropoff, isLoaded, geocodeAddress]);
    
    useEffect(() => {
        if (!pickupCoords || !dropoffCoords) {
            if (!pickupCoords && !dropoffCoords) {
                // Reset to default view if both are cleared
                setZoom(4);
                setMapCenter({ lat: 39.8283, lng: -98.5795 });
            }
            setDirections(null);
        } else {
            setDirections(null); // Force re-fetch of directions when coords change
        }
    }, [pickupCoords, dropoffCoords]);

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        if(onMapLoad) onMapLoad(map);
    }, [onMapLoad]);

    useEffect(() => {
        if (mapRef.current && pickupCoords && dropoffCoords) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(pickupCoords);
            bounds.extend(dropoffCoords);
            mapRef.current.fitBounds(bounds, 100); // 100px padding
            setActiveInfoWindow(null); // Hide individual info windows when showing a route
        }
    }, [directions, pickupCoords, dropoffCoords]);


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
                zoom={zoom}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
                onLoad={onLoad}
            >
                {pickupCoords && pickup && (
                    <Marker 
                        position={pickupCoords} 
                        icon={pickupIcon} 
                        animation={window.google.maps.Animation.DROP}
                        onClick={() => setActiveInfoWindow('pickup')}
                    >
                         {activeInfoWindow === 'pickup' && (
                             <InfoWindow onCloseClick={() => setActiveInfoWindow(null)} position={pickupCoords}>
                                <div className="p-1 font-sans">
                                    <h4 className="font-bold text-sm text-primary">Pickup</h4>
                                    <p className="text-xs text-foreground">{pickup}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                )}

                {dropoffCoords && dropoff && (
                    <Marker 
                        position={dropoffCoords} 
                        icon={dropoffIcon} 
                        animation={window.google.maps.Animation.DROP}
                        onClick={() => setActiveInfoWindow('dropoff')}
                    >
                       {activeInfoWindow === 'dropoff' && (
                             <InfoWindow onCloseClick={() => setActiveInfoWindow(null)} position={dropoffCoords}>
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
                                strokeColor: "hsl(217 91% 60%)", // Primary color
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
