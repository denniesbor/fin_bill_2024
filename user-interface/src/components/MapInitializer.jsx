import React, { useEffect, useContext } from "react";
import loadScript from "../utils/loadScript";
import { AppContext } from "../contextAPI";

const MapInitializer = ({ onLoad, onError }) => {
  const { setMapInstance, setLocation } = useContext(AppContext);

  useEffect(() => {
    const initializeMap = () => {
      window.initMap = () => {
        getLocation();
      };

      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }&loading=async&libraries=places,marker,geometry&callback=initMap&v=weekly`,
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

    if (onLoad) onLoad();
  }, [onLoad]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          initMap({ lat: latitude, lng: longitude });
        },
        (err) => {
          if (onError) {
            onError("Location access denied. Please enable location services.");
          }
          console.error(err);
        }
      );
    } else {
      if (onError) {
        onError("Geolocation is not supported by this browser.");
      }
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

  return <div id="map" style={{ width: "100%", height: "50vh" }}></div>;
};

export default MapInitializer;
