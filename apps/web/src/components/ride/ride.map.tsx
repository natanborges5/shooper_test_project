import React, { useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { Loader } from '@mantine/core';

const MapWithRoute = ({ routeResponse }: { routeResponse: any }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "",
  });
  const directionsResponse = useRef(null);
  console.log(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
  const initializeRoute = useCallback(() => {
    if (routeResponse && routeResponse.routes.length > 0) {
      directionsResponse.current = routeResponse.routes[0];
    }
  }, [routeResponse]);

  if (!isLoaded) return <Loader />;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={{
        lat: routeResponse.routes[0].legs[0].start_location.lat,
        lng: routeResponse.routes[0].legs[0].start_location.lng,
      }}
      zoom={14}
      onLoad={initializeRoute}
    >
      {directionsResponse.current && (
        <DirectionsRenderer
          options={{
            directions: {
              routes: [directionsResponse.current],
              request: {
                origin: routeResponse.routes[0].legs[0].start_address,
                destination: routeResponse.routes[0].legs[0].end_address,
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: routeResponse.geocoded_waypoints[0]
              }
            },
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapWithRoute;
