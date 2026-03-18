
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { useGoogleMaps } from '@/context/google-maps-provider';

// Helper component to draw a polyline on the map
const CustomPolyline = (props: google.maps.PolylineOptions) => {
    const map = useMap();
    const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

    useEffect(() => {
        if (!map) return;
        
        const p = new window.google.maps.Polyline(props);
        setPolyline(p);
        p.setMap(map);

        return () => {
            p.setMap(null);
        };
    }, [map]); // Only re-create if the map instance changes

    useEffect(() => {
        if(polyline) polyline.setPath(props.path || []);
    }, [polyline, props.path]);

    return null;
};

// Helper component to get the map instance
const MapInstanceHandler = ({ setMap, onMapLoad }: { setMap: (map: google.maps.Map) => void, onMapLoad?: (map: google.maps.Map) => void }) => {
    const map = useMap();
    useEffect(() => {
        if (map) {
            setMap(map);
            if (onMapLoad) {
                onMapLoad(map);
            }
        }
    }, [map, setMap, onMapLoad]);
    return null;
};


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
  onMapClick?: (latLng: google.maps.LatLngLiteral) => void;
}

export default function InteractiveMapPlaceholder({ pickup, dropoff, onMapLoad, setPickup, setDropoff, availableVehicles = [], onMapClick }: InteractiveMapPlaceholderProps) {
    const { isLoaded, loadError } = useGoogleMaps();
    
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    mapRef.current = map;

    const [pickupCoords, setPickupCoords] = useState<google.maps.LatLngLiteral | null>(null);
    const [dropoffCoords, setDropoffCoords] = useState<google.maps.LatLngLiteral | null>(null);
    
    const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
    const [animatedPath, setAnimatedPath] = useState<google.maps.LatLng[]>([]);
    
    const [activeInfoWindow, setActiveInfoWindow] = useState<'pickup' | 'dropoff' | null>(null);
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 39.8283, lng: -98.5795 });
    const [zoom, setZoom] = useState(4);
    const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);


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
            setZoom(4);
            setMapCenter({ lat: 39.8283, lng: -98.5795 });
            setDirectionsResult(null);
            setActiveInfoWindow(null);
        } else if (pickupCoords && dropoffCoords) {
            if(isLoaded) {
                 const directionsService = new window.google.maps.DirectionsService();
                 directionsService.route({
                    origin: pickupCoords,
                    destination: dropoffCoords,
                    travelMode: window.google.maps.TravelMode.DRIVING
                 }, (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK && result) {
                        setDirectionsResult(result);
                        setActiveInfoWindow(null);
                    } else {
                        console.error(`Directions request failed due to ${status}`);
                    }
                 });
            }
        } else if (pickupCoords) {
             setMapCenter(pickupCoords);
             setZoom(18);
             setActiveInfoWindow('pickup');
             setDirectionsResult(null);
        } else if (dropoffCoords) {
             setMapCenter(dropoffCoords);
             setZoom(18);
             setActiveInfoWindow('dropoff');
             setDirectionsResult(null);
        }
    }, [pickupCoords, dropoffCoords, isLoaded]);
    
    useEffect(() => {
        if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
        }
        
        if (directionsResult && directionsResult.routes[0]) {
            const path = directionsResult.routes[0].overview_path;
            setAnimatedPath([]);
            
            let step = 0;
            const steps = path.length;
            const animationSpeed = 20;

            animationIntervalRef.current = setInterval(() => {
                if (step >= steps) {
                    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
                    return;
                }
                setAnimatedPath(prev => path.slice(0, step + 1));
                step++;
            }, animationSpeed);
            
            if(mapRef.current) {
                const bounds = new window.google.maps.LatLngBounds();
                path.forEach(point => bounds.extend(point));
                mapRef.current.fitBounds(bounds, 100);
            }

        } else {
            setAnimatedPath([]);
        }

        return () => {
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
            }
        };

    }, [directionsResult]);

    const handleMarkerClick = (coords: google.maps.LatLngLiteral, infoWindow: 'pickup' | 'dropoff') => {
        if(mapRef.current) {
            mapRef.current.panTo(coords);
            mapRef.current.setZoom(18);
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

    const getShortAddress = (fullAddress: string) => {
        return fullAddress.split(',')[0];
    };

    const renderMap = () => {
        if (loadError) {
            return <div>Error loading map</div>;
        }

        if (!isLoaded) {
            return <div>Loading map...</div>;
        }

        return (
            <Map
                center={mapCenter}
                zoom={zoom}
                disableDefaultUI={true}
                mapId={'ROAMFREE_MAP_STYLE'}
                onClick={(e) => onMapClick && e.detail.latLng && onMapClick(e.detail.latLng)}
            >
                <MapInstanceHandler setMap={setMap} onMapLoad={onMapLoad} />
                {pickupCoords && pickup && (
                    <AdvancedMarker 
                        position={pickupCoords} 
                        onClick={() => handleMarkerClick(pickupCoords, 'pickup')}
                    >
                        <Pin
                            background={'#228be6'} /* blue-600 */
                            borderColor={'#1971c2'} /* blue-700 */
                            glyphColor={'#fff'}
                        />
                    </AdvancedMarker>
                )}

                {activeInfoWindow === 'pickup' && pickupCoords && pickup && (
                     <InfoWindow position={pickupCoords} onCloseClick={() => setActiveInfoWindow(null)}>
                         <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg font-sans cursor-pointer" onClick={() => handleInfoClick('pickup')}>
                            <span className="font-bold text-black">FROM {getShortAddress(pickup)}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                    </InfoWindow>
                )}

                {dropoffCoords && dropoff && (
                    <AdvancedMarker 
                        position={dropoffCoords} 
                        onClick={() => handleMarkerClick(dropoffCoords, 'dropoff')}
                    >
                       <Pin />
                    </AdvancedMarker>
                )}

                {activeInfoWindow === 'dropoff' && dropoffCoords && dropoff && (
                     <InfoWindow position={dropoffCoords} onCloseClick={() => setActiveInfoWindow(null)}>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg font-sans cursor-pointer" onClick={() => handleInfoClick('dropoff')}>
                            <span className="font-bold text-black">TO {getShortAddress(dropoff)}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                    </InfoWindow>
                )}
                
                {animatedPath.length > 0 && (
                     <CustomPolyline
                        path={animatedPath}
                        strokeColor={"hsl(217 91% 60%)"}
                        strokeOpacity={0.8}
                        strokeWeight={6}
                    />
                )}
                
                {availableVehicles.map(vehicle => (
                    <AdvancedMarker
                        key={vehicle.id}
                        position={vehicle.position}
                        title={vehicle.type}
                    >
                        <span className="text-2xl">{vehicle.type === 'car' ? '🚗' : '🛵'}</span>
                    </AdvancedMarker>
                ))}
            </Map>
        );
    };

    return (
        <>
            {loadError && <div>Error loading map</div>}
            {!isLoaded && <div>Loading map...</div>}
            {isLoaded && renderMap()}
        </>
    );
}
