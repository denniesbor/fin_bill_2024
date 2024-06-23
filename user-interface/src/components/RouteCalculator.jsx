import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../contextAPI";

const RouteCalculator = () => {
  const { mapInstance, location, nearestMarkersInfo, routeMode, townCoords } =
    useContext(AppContext);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (mapInstance && !directionsService && !directionsRenderer) {
      const service = new google.maps.DirectionsService();
      const renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#800080",
          strokeOpacity: 0.7,
          strokeWeight: 5,
        },
      });
      renderer.setMap(mapInstance);
      setDirectionsService(service);
      setDirectionsRenderer(renderer);
    }
  }, [mapInstance, directionsService, directionsRenderer]);

  useEffect(() => {
    if (routeMode && nearestMarkersInfo.length > 0) {
      nearestMarkersInfo.forEach((markerInfo) => {
        calculateRoute(markerInfo.position);
      });
    } else if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
  }, [routeMode, nearestMarkersInfo, location]);

  const calculateRoute = (destination) => {
    const userLocation = new google.maps.LatLng(location.lat, location.lng);

    const [lat, lng] = destination.replace(/[()]/g, "").split(", ").map(Number);

    const destLocation = new google.maps.LatLng(lat, lng);

    if (directionsService && directionsRenderer) {
      directionsService.route(
        {
          origin: userLocation ? userLocation : townCoords,
          destination: destLocation,
          travelMode: "WALKING",
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        }
      );
    }
  };

  return null;
};

export default RouteCalculator;
