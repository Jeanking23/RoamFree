
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

        const primaryColor = "hsl(217 91% 60%)";
        const carIcon = {
            path: 'm21.7-2.4-1-3.6c-.2-.7-.8-1.1-1.5-1.1h-14c-.7 0-1.3.5-1.5 1.1l-1 3.6c-.1.2-.1.5 0 .7.1.3.4.5.7.5h1.3c.5 0 .9-.3 1.1-.7l.9-3.2h11l.9 3.2c.2.4.6.7 1.1.7h1.3c.3 0 .6-.2.7-.5.1-.2.1-.5 0-.7zM4.3 9.4l.6-2.1h14.2l.6 2.1H4.3zM2.8 20.3c-.6.2-1 .7-1 1.3v1.6c0 .5.4.9.9.9h.9c.4 0 .8-.4.9-.8l.4-1.6H5c.4 0 .7-.3.8-.7l.6-2.2h-3c-.4 0-.7.3-.8.7l-.3 1.1zM21.2 20.3c-.1-.4-.4-.7-.8-.7h-3l.6 2.2c.1.4.4.7.8.7h.6l.4 1.6c.1.4.5.8.9.8h.9c.5 0 .9-.4.9-.9v-1.6c0-.6-.4-1.1-1-1.3zM4.9 14.1h14.2c.5 0 .9-.4.9-.9V9.6c0-.5-.4-.9-.9-.9H4.9c-.5 0-.9.4-.9.9v3.6c0 .5.4.9.9.9z',
            fillColor: primaryColor,
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 1,
            anchor: new google.maps.Point(12, 12),
        };

        const motorbikeIcon = {
            path: 'M18.9,3.1c-0.6-0.3-1.3-0.1-1.7,0.4l-3.3,4.1H8.1l-3.3-4.1C4.4,2.9,3.7,2.8,3.1,3.1C2.5,3.4,2.3,4.1,2.6,4.7l3.7,4.7v5.8c0,0.5,0.4,1,1,1h1.5c0.5,0,1-0.4,1-1v-2.1h2.5v2.1c0,0.5,0.4,1,1,1H15c0.5,0,1-0.4,1-1v-5.8l3.7-4.7C20.2,4.1,19.5,3.4,18.9,3.1z M8.9,7.3h6.2L12,3.9L8.9,7.3z M7,21.8c-1.5,0-2.8-1.2-2.8-2.8s1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8S8.5,21.8,7,21.8z M17,21.8c-1.5,0-2.8-1.2-2.8-2.8s1.2-2.8,2.8-2.8s2.8,1.2,2.8,2.8S18.5,21.8,17,21.8z',
            fillColor: primaryColor,
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
