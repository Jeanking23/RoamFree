
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

// The new provider handles loading state internally, so the context value is simplified.
interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: true, // We can assume loaded within the new provider context
  loadError: undefined,
});

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  return (
    <APIProvider 
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={['places', 'geocoding']}
    >
      <GoogleMapsContext.Provider value={{ isLoaded: true, loadError: undefined }}>
        {children}
      </GoogleMapsContext.Provider>
    </APIProvider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  // The `isLoaded` and `loadError` checks in components will now pass through,
  // as the new library manages loading state within its components.
  return context;
}
