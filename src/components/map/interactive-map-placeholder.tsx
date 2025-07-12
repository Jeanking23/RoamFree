import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Map, MapPin } from 'lucide-react';

interface InteractiveMapPlaceholderProps {
  pickup?: string;
  dropoff?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 39.8283, // Center of the US
  lng: -98.5795
};

const libraries: ("places" | "maps")[] = ['places', 'maps'];

export default function InteractiveMapPlaceholder({ pickup, dropoff }: InteractiveMapPlaceholderProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

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
                center={center}
                zoom={4}
            >
                {/* Add markers, directions, etc. here later */}
                <Marker position={{ lat: 40.7128, lng: -74.0060 }} label="P" title={pickup || "Pickup"}/>
                <Marker position={{ lat: 34.0522, lng: -118.2437 }} label="D" title={dropoff || "Dropoff"}/>
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
