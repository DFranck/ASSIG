import { GoogleMap, Marker } from '@react-google-maps/api';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Location } from './LocationSelection';

interface GoogleMapsComponentProps {
  isLoaded: boolean;
  mapCenter: Location;
  handleMapClick: (event: google.maps.MapMouseEvent) => void;
}

const GoogleMapsComponent = ({
  isLoaded,
  mapCenter,
  handleMapClick,
}: GoogleMapsComponentProps) => {
  const { setValue } = useFormContext();
  const mapRef = useRef<google.maps.Map | null>(null);

  // Mise à jour du zoom lorsqu'il change
  const updateZoom = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom() || 14;
      setValue('mapZoom', newZoom); // Met à jour `mapZoom` dans le formulaire
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
            mapRef.current = map; // Enregistrer la référence de la carte
          }}
          onIdle={updateZoom} // Appelé lorsque l'utilisateur arrête de zoomer
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      )}
    </>
  );
};

export default GoogleMapsComponent;
