'use client';
import { Project } from '@/models/projectModel';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Location } from './LocationSelection';
const libraries: ('places' | 'geometry' | 'drawing' | 'visualization')[] = [
  'places',
];

interface GoogleMapsComponentProps {
  mapCenter: Location;
  handleMapClick?: (event: google.maps.MapMouseEvent) => void;
  projects?: Project[];
}

const GoogleMapsComponent = ({
  mapCenter,
  handleMapClick,
  projects = [],
}: GoogleMapsComponentProps) => {
  const formContext = useFormContext();
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  const setValue = projects.length === 0 ? formContext?.setValue : undefined;

  const updateZoom = () => {
    if (mapRef.current && setValue) {
      const newZoom = mapRef.current.getZoom() || 14;
      setValue('mapZoom', newZoom);
    }
  };
  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={14}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onIdle={updateZoom}
        >
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <Marker
                key={index}
                position={{ lat: project.latitude, lng: project.longitude }}
                title={project.title}
              />
            ))
          ) : (
            // Affiche un seul marqueur basé sur `mapCenter` si aucun projet n'est défini
            <Marker position={mapCenter} />
          )}
        </GoogleMap>
      )}
    </>
  );
};

export default GoogleMapsComponent;
