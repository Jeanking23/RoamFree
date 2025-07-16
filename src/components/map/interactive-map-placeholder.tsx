
import { GoogleMap, MarkerF as Marker, DirectionsService, DirectionsRenderer, InfoWindowF as InfoWindow } from '@react-google-maps/api';
import { Map } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useGoogleMaps } from '@/context/google-maps-provider';

export interface AvailableVehicle {
  id: string;
  position: google.maps.LatLngLiteral;
  type: 'car' | 'motorbike';
}

interface InteractiveMapPlaceholderProps {
  pickup?: string;
  dropoff?: string;
  onMapLoad?: (map: google.maps.Map) => void;
  setPickup?: (address: string) => void;
  setDropoff?: (address: string) => void;
  availableVehicles?: AvailableVehicle[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function InteractiveMapPlaceholder({ pickup, dropoff, onMapLoad, setPickup, setDropoff, availableVehicles = [] }: InteractiveMapPlaceholderProps) {
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
        setter: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral | null>>
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
        if (!pickupCoords && !dropoffCoords) {
            // Reset to default view if both are cleared
            setZoom(4);
            setMapCenter({ lat: 39.8283, lng: -98.5795 });
            setDirections(null);
            setActiveInfoWindow(null);
        } else if (pickupCoords && dropoffCoords) {
            setDirections(null); // Force re-fetch of directions when both coords are available
            setActiveInfoWindow(null); // Hide info windows initially when showing a route
        } else if (pickupCoords) {
             setMapCenter(pickupCoords);
             setZoom(16);
             setActiveInfoWindow('pickup');
             setDirections(null);
        } else if (dropoffCoords) {
             setMapCenter(dropoffCoords);
             setZoom(16);
             setActiveInfoWindow('dropoff');
             setDirections(null);
        }
    }, [pickupCoords, dropoffCoords]);


    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        if(onMapLoad) onMapLoad(map);
    }, [onMapLoad]);

    useEffect(() => {
        if (mapRef.current && directions) {
            const bounds = new window.google.maps.LatLngBounds();
            if(pickupCoords) bounds.extend(pickupCoords);
            if(dropoffCoords) bounds.extend(dropoffCoords);
            if(bounds.getNorthEast().equals(bounds.getSouthWest())) {
                mapRef.current.setCenter(bounds.getCenter());
                mapRef.current.setZoom(16);
            } else {
                 mapRef.current.fitBounds(bounds, 100); // 100px padding
            }
        }
    }, [directions, pickupCoords, dropoffCoords]);


    const handleDirectionsResponse = (
        response: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
    ) => {
        if (status === 'OK' && response) {
            setDirections(response);
            setActiveInfoWindow(null); // Hide individual popups when route is shown
        } else {
            console.error(`Directions request failed due to ${status}`);
        }
    };
    
    const handleMarkerClick = (coords: google.maps.LatLngLiteral, infoWindow: 'pickup' | 'dropoff') => {
        if(mapRef.current) {
            mapRef.current.panTo(coords);
            mapRef.current.setZoom(17);
        }
        setActiveInfoWindow(infoWindow);
    };

    const handleInfoClick = (type: 'pickup' | 'dropoff') => {
        if (type === 'pickup' && pickup && setPickup) {
            setPickup(pickup);
        } else if (type === 'dropoff' && dropoff && setDropoff) {
            setDropoff(dropoff);
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

        const carIcon = {
            path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
            fillColor: '#000000',
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 1.2,
            anchor: new google.maps.Point(12, 12),
        };

        const motorbikeIcon = {
            path: 'M12.28 2.05c-.17-.03-.34-.05-.51-.05C8.95 2 6.71 4.24 6.71 7v1.08c0 .35.13.68.36.95L8.5 11h7l1.43-2.05c.23-.27.36-.6.36-.95V7c0-2.76-2.24-5-4.99-5-.17 0-.34.02-.52.05zM12 4c1.66 0 3 1.34 3 3v1H9V7c0-1.66 1.34-3 3-3zM5.12 12l-.74 2.6c-.1.35.03.73.33 1L6 17h12l1.29-1.4c.3-.27.43-.65.33-1L18.88 12H5.12zM6.5 20c-.83 0-1.5-.67-1.5-1.5S5.67 17 6.5 17s1.5.67 1.5 1.5S7.33 20 6.5 20zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
            fillColor: '#000000',
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 1.2,
            anchor: new google.maps.Point(12, 12),
        };

        const getShortAddress = (fullAddress: string) => {
            return fullAddress.split(',')[0];
        };
        
        const infoWindowOptions = {
            pixelOffset: new window.google.maps.Size(0, -40),
            disableAutoPan: true,
            closeButton: false, 
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
                        onClick={() => handleMarkerClick(pickupCoords, 'pickup')}
                    >
                         {activeInfoWindow === 'pickup' && (
                             <InfoWindow position={pickupCoords} options={infoWindowOptions}>
                                 <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg font-sans cursor-pointer" onClick={() => handleInfoClick('pickup')}>
                                    <span className="font-bold text-black">FROM {getShortAddress(pickup)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="m9 18 6-6-6-6"/></svg>
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
                        onClick={() => handleMarkerClick(dropoffCoords, 'dropoff')}
                    >
                       {activeInfoWindow === 'dropoff' && (
                             <InfoWindow position={dropoffCoords} options={infoWindowOptions}>
                                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg font-sans cursor-pointer" onClick={() => handleInfoClick('dropoff')}>
                                    <span className="font-bold text-black">TO {getShortAddress(dropoff)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="m9 18 6-6-6-6"/></svg>
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

                {availableVehicles.map(vehicle => (
                    <Marker
                        key={vehicle.id}
                        position={vehicle.position}
                        icon={vehicle.type === 'car' ? carIcon : motorbikeIcon}
                        title={vehicle.type}
                    />
                ))}

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
