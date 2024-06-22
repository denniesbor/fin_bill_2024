import React, { useContext, useEffect } from "react";
import { AppContext } from "../contextAPI";

const NearestMarkerCalculator = () => {
  const { location, markers, setNearestMarkersInfo } = useContext(AppContext);

  useEffect(() => {
    if (location && markers.length) {
      findNearbyMarkers();
    }
  }, [location, markers]);

  const findNearbyMarkers = () => {
    const userLocation = new google.maps.LatLng(location.lat, location.lng);
    const nearbyMarkers = markers
      .map(({ marker }) => {
        const markerPosition = marker.getPosition();
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          userLocation,
          markerPosition
        );
        return { distance, position: markerPosition.toString() };
      })
      .filter(({ distance }) => distance < 4000);

    setNearestMarkersInfo(nearbyMarkers);
  };

  return null;
};

export default NearestMarkerCalculator;
