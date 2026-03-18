
import { GoogleMap, MarkerF as Marker, InfoWindowF as InfoWindow } from '@react-google-maps/api';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useGoogleMaps } from '@/context/google-maps-provider';

interface Property {
  id: string;
  name: string;
  type: string;
  price: string;
  rating: number;
  image: string;
  position: google.maps.LatLngLiteral;
}

interface PropertiesMapProps {
  properties: Property[];
  activePropertyId?: string | null;
  onActivePropertyChange: (id: string | null) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function PropertiesMap({ properties, activePropertyId, onActivePropertyChange }: PropertiesMapProps) {
    const { isLoaded, loadError } = useGoogleMaps();
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
    const [zoom, setZoom] = useState(12);
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        if (properties.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            properties.forEach(p => bounds.extend(p.position));
            if (mapRef.current) {
                mapRef.current.fitBounds(bounds, 100);
            }
        } else {
             setMapCenter({ lat: 40.7128, lng: -74.0060 });
             setZoom(12);
        }
    }, [properties]);

    useEffect(() => {
        setActiveMarker(activePropertyId || null);
         if (activePropertyId) {
            const activeProperty = properties.find(p => p.id === activePropertyId);
            if (activeProperty && mapRef.current) {
                mapRef.current.panTo(activeProperty.position);
                if(mapRef.current.getZoom()! < 15) {
                     mapRef.current.setZoom(15);
                }
            }
        }
    }, [activePropertyId, properties]);

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const handleMarkerClick = (propertyId: string) => {
        onActivePropertyChange(propertyId);
    };
    
    const getPriceMarkerIcon = (price: string, isActive: boolean) => {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 30" width="80" height="30">
                <rect x="0" y="0" width="80" height="30" rx="15" ry="15" fill="${isActive ? '#1d4ed8' : '#ffffff'}" stroke="${isActive ? '#ffffff' : '#e5e7eb'}" stroke-width="2" />
                <text x="40" y="20" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="${isActive ? '#ffffff' : '#1f2937'}">${price}</text>
            </svg>
        `;
        return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg) };
    };

    if (loadError) {
        return <div>Error loading map</div>;
    }

    if (!isLoaded) {
        return <div>Loading Map...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            onLoad={onLoad}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
                mapId: 'ROAMFREE_MAP_STYLE'
            }}
        >
            {properties.map(property => (
                <Marker
                    key={property.id}
                    position={property.position}
                    icon={getPriceMarkerIcon(property.price, property.id === activeMarker)}
                    onClick={() => handleMarkerClick(property.id)}
                    zIndex={property.id === activeMarker ? 10 : 1}
                />
            ))}
        </GoogleMap>
    );
}
