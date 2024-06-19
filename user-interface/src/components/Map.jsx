import React, { useEffect, useContext, useState } from "react";
import loadScript from "../utils/loadScript";
import { AppContext } from "../contextAPI";
import MarkerComponent from "./MarkerComponent";
import NearestMarkerInfo from "./NearestMarkerInfo";

const Map = () => {
  const {
    mapInstance,
    setMapInstance,
    location,
    setLocation,
    markers,
    routeMode,
  } = useContext(AppContext);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [nearestMarkerInfo, setNearestMarkerInfo] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      window.initMap = () => {
        getLocation();
      };

      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }&loading=async&libraries=places,marker&callback=initMap&v=weekly`,
        () => {
          if (typeof google !== "undefined") {
            window.initMap();
          }
        }
      );
    };

    if (typeof google === "undefined") {
      initializeMap();
    } else {
      window.initMap();
    }
  }, []);

  useEffect(() => {
    if (mapInstance && !directionsService && !directionsRenderer) {
      const service = new google.maps.DirectionsService();
      const renderer = new google.maps.DirectionsRenderer();
      renderer.setMap(mapInstance);
      setDirectionsService(service);
      setDirectionsRenderer(renderer);
    }
  }, [mapInstance, directionsService, directionsRenderer]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        initMap({ lat: latitude, lng: longitude });
      });
    }
  };

  const initMap = (location) => {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: location,
      zoom: 15,
    });

    new google.maps.Marker({
      position: location,
      map: map,
      title: "Your Location",
    });

    setMapInstance(map);
  };

  const findNearestMarker = () => {
    if (!markers.length || !location.lat || !location.lng) return;

    const userLocation = new google.maps.LatLng(location.lat, location.lng);
    let nearestMarker = null;
    let shortestDistance = Infinity;

    markers.forEach(({ marker }) => {
      const markerPosition = marker.getPosition();
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        userLocation,
        markerPosition
      );
      if (distance < 2000 && distance < shortestDistance) {
        shortestDistance = distance;
        nearestMarker = marker;
      }
    });

    if (nearestMarker) {
      setNearestMarkerInfo({
        distance: shortestDistance,
        position: nearestMarker.getPosition().toString(),
      });

      if (directionsService && directionsRenderer) {
        directionsService.route(
          {
            origin: userLocation,
            destination: nearestMarker.getPosition(),
            travelMode: google.maps.TravelMode.WALKING,
          },
          (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(response);
              directionsRenderer.setOptions({
                polylineOptions: {
                  strokeColor: "#800080", // Purplish color
                  strokeOpacity: 0.7,
                  strokeWeight: 5,
                },
                suppressMarkers: true, // Suppress default A and B markers
              });
            } else {
              console.error(`Directions request failed due to ${status}`);
            }
          }
        );
      }
    } else {
      setNearestMarkerInfo(null);
    }
  };

  useEffect(() => {
    if (routeMode) {
      findNearestMarker();
    } else if (directionsRenderer) {
      directionsRenderer.set("directions", null);
      setNearestMarkerInfo(null);
    }
  }, [routeMode]);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "50vh" }}></div>
      <MarkerComponent />
      {routeMode && nearestMarkerInfo && (
        <NearestMarkerInfo nearestMarkerInfo={nearestMarkerInfo} />
      )}
    </div>
  );
};

export default Map;
