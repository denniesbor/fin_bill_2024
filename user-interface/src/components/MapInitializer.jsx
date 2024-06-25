import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../contextAPI";
import withGoogleMaps from "../utils/withGoogleMaps";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loadGoogleMapsScript = (callback) => {
  if (!window.google) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  } else {
    callback();
  }
};

const MapInitializer = ({ onLoad, onError }) => {
  const {
    setMapInstance,
    setLocation,
    setMapLoaded,
    setTownCoords,
    fallbackData,

  } = useContext(AppContext);
  const [selectedTown, setSelectedTown] = useState("nairobi");
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    window.initMap = () => {
      getLocation();
    };

    loadGoogleMapsScript(() => {
      if (typeof google !== "undefined") {
        window.initMap();
      }
    });

    if (onLoad) onLoad();
  }, [onLoad, selectedTown]);

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
          if (fallbackData) {
            const nairobiCoords = fallbackData.nairobi.gps.map(parseFloat);
            initMap({ lat: nairobiCoords[0], lng: nairobiCoords[1] });
          }
          setLocationDenied(true);
        }
      );
    } else {
      if (onError) {
        onError("Geolocation is not supported by this browser.");
      }
      if (fallbackData) {
        const nairobiCoords = fallbackData.nairobi.gps.map(parseFloat);
        setTownCoords({ lat: nairobiCoords[0], lng: nairobiCoords[1] });
        initMap({ lat: nairobiCoords[0], lng: nairobiCoords[1] });
      }
      setLocationDenied(true);
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
    setMapLoaded(true); // Set mapLoaded to true in AppContext
  };

  const handleTownChange = (event) => {
    const town = event.target.value;
    setSelectedTown(town);
    if (fallbackData && fallbackData[town]) {
      const coords = fallbackData[town].gps.map(parseFloat);
      setTownCoords({ lat: coords[0], lng: coords[1] });
      initMap({ lat: coords[0], lng: coords[1] });
    }
  };

  // Render the map on refresh when location is not available and town is selected
  useEffect(() => {
    if (fallbackData) {
      const coords = fallbackData[selectedTown]?.gps.map(parseFloat);
      if (coords) {
        initMap({ lat: coords[0], lng: coords[1] });
      }
    }
  }, [fallbackData, selectedTown]);

  return (
    <div className="relative mt-4">
      <div
        id="map"
        style={{ width: "100%", height: "50vh", position: "relative" }}
      ></div>
      {fallbackData && locationDenied && (
        <div className="mt-4 flex flex-col items-center">
          <label htmlFor="town-select" className="mr-2 text-sm font-semibold">
            Select a town:
          </label>
          <select
            id="town-select"
            value={selectedTown}
            onChange={handleTownChange}
            className="mt-2 p-2 border border-gray-300 rounded"
          >
            {Object.keys(fallbackData)
              .sort()
              .map((town) => (
                <option key={town} value={town}>
                  {town.charAt(0).toUpperCase() + town.slice(1)}
                </option>
              ))}
          </select>
          <p className="mt-4 text-sm text-red-600 text-center">
            Location access denied. For precise location, enable location
            services and refresh the page.
          </p>
        </div>
      )}
    </div>
  );
};

export default withGoogleMaps(MapInitializer, GOOGLE_MAPS_API_KEY);
