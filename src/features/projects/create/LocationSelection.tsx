'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import GoogleMapsComponent from './GoogleMap';

export interface Location {
  lat: number;
  lng: number;
}

const libraries: ('places' | 'geometry' | 'drawing' | 'visualization')[] = [
  'places',
];

const LocationSelection = () => {
  const { setValue, getValues, formState, register } = useFormContext();
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: getValues('latitude') || 37.7749,
    lng: getValues('longitude') || -122.4194,
  });
  const [locationText, setLocationText] = useState<string>(
    getValues('location') || '',
  );
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const fetchAddress = useCallback(
    async (lat: number, lng: number) => {
      if (!isLoaded) return;

      const geocoder = new google.maps.Geocoder();
      const location = { lat, lng };

      geocoder.geocode({ location }, async (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setLocationText(results[0].formatted_address);
          setValue('location', results[0].formatted_address);
        } else {
          console.error('Geocoder failed:', status);
        }
      });
    },
    [isLoaded, setValue],
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setValue('latitude', currentLocation.lat);
        setValue('longitude', currentLocation.lng);
        setMapCenter(currentLocation);
        fetchAddress(currentLocation.lat, currentLocation.lng);
      },
      (error) => console.error('Geolocation error:', error),
    );
  }, [isLoaded, setValue, fetchAddress]);

  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const lat = place.geometry?.location?.lat() || 0;
        const lng = place.geometry?.location?.lng() || 0;
        const formattedAddress = place.formatted_address || '';

        setValue('latitude', lat);
        setValue('longitude', lng);
        setMapCenter({ lat, lng });
        setLocationText(formattedAddress);
      }
    }
  }, [setValue]);

  return (
    <div className="flex flex-col gap-4">
      <Label>
        Location<span className="text-red-500">*</span>{' '}
        <span className="text-xs italic">Set your location and zoom level</span>
      </Label>
      <div className="search-box">
        {isLoaded ? (
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <>
              <Input
                {...register('location')}
                type="text"
                placeholder={
                  locationText ? locationText : 'Search for a location'
                }
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />{' '}
              {formState.errors.location && (
                <p className="text-red-500 text-sm">
                  {formState.errors.location?.message as string}
                </p>
              )}
            </>
          </StandaloneSearchBox>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {isLoaded && (
        <div className="map-container h-96 border w-full rounded-lg overflow-hidden">
          <GoogleMapsComponent
            mapCenter={mapCenter}
            handleMapClick={(event) => {
              if (event.latLng) {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                setValue('latitude', lat);
                setValue('longitude', lng);
                setMapCenter({ lat, lng });
                fetchAddress(lat, lng);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LocationSelection;
