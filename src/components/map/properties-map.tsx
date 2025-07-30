
'use client';

import { GoogleMap, MarkerF as Marker, InfoWindowF as InfoWindow } from '@react-google-maps/api';
import { Map } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useGoogleMaps } from '@/context/google-maps-provider';
import type { MockStay } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertiesMapProps {
  properties: MockStay[];
}

interface PropertyWithCoords extends MockStay {
  coords: google.maps.LatLngLiteral;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function PropertiesMap({ properties }: PropertiesMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [propertiesWithCoords, setPropertiesWithCoords] = useState<PropertyWithCoords[]>([]);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 39.8283, lng: -98.5795 }); // Center of US
  const [zoom, setZoom] = useState(4);

  const geocodeAddress = useCallback((address: string): Promise<google.maps.LatLngLiteral | null> => {
    return new Promise((resolve) => {
      if (!isLoaded) {
        resolve(null);
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          console.error(`Geocode failed for "${address}": ${status}`);
          resolve(null);
        }
      });
    });
  }, [isLoaded]);

  useEffect(() => {
    const processProperties = async () => {
      const geocodedProperties = await Promise.all(
        properties.map(async (prop) => {
          const coords = await geocodeAddress(prop.location);
          return coords ? { ...prop, coords } : null;
        })
      );
      const validProperties = geocodedProperties.filter((p): p is PropertyWithCoords => p !== null);
      setPropertiesWithCoords(validProperties);

      if (validProperties.length > 0) {
        // Calculate bounds and set map center/zoom
        const bounds = new window.google.maps.LatLngBounds();
        validProperties.forEach(({ coords }) => bounds.extend(coords));
        if (validProperties.length === 1) {
          setMapCenter(validProperties[0].coords);
          setZoom(12);
        } else {
            // This is a simplified way to set center. fitBounds is better but requires a map instance.
            setMapCenter(bounds.getCenter().toJSON());
            // A proper zoom calculation would be more complex.
            setZoom(4); 
        }
      }
    };
    if (properties.length > 0) {
        processProperties();
    }
  }, [properties, geocodeAddress]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <Skeleton className="w-full h-full" />;

  const handleMarkerClick = (propertyId: string) => {
    setActiveMarker(propertyId);
  };
  
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={zoom}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      {propertiesWithCoords.map((prop) => (
        <Marker
          key={prop.id}
          position={prop.coords}
          onClick={() => handleMarkerClick(prop.id)}
          label={{
            text: `$${((prop.price ?? 0) / 1000).toFixed(0)}k`,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px',
          }}
          icon={{
             path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
             fillColor: 'hsl(var(--primary))',
             fillOpacity: 1,
             strokeWeight: 1,
             strokeColor: 'white',
             rotation: 0,
             scale: 1.5,
             anchor: new google.maps.Point(12, 24),
             labelOrigin: new google.maps.Point(12, 10)
          }}
        >
          {activeMarker === prop.id && (
            <InfoWindow
              position={prop.coords}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="w-48">
                <div className="relative h-24 w-full mb-2">
                  <Image src={prop.image} alt={prop.name} fill className="object-cover rounded-t-md" />
                </div>
                <div className="p-1">
                    <h4 className="font-bold text-sm truncate">{prop.name}</h4>
                    <p className="text-primary font-semibold">${(prop.price ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{prop.bedrooms} bds | {prop.bathrooms} ba</p>
                    <Button asChild variant="link" size="sm" className="p-0 h-auto mt-1">
                        <Link href={`/buy-property/${prop.id}`}>View Details</Link>
                    </Button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
}
