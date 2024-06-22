import React, { createContext, useState, useEffect } from "react";
import updatedMembers from "./data/updated_members.json";
import axios from "axios";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [toggleAdd, setToggleAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [location, setLocation] = useState([]);
  const [routeMode, setRouteMode] = useState(false);
  const [nearestMarkersInfo, setNearestMarkersInfo] = useState([]);
  const [mpigs, setMpigs] = useState([]);
  const [q1Loading, setQ1Loading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [townCoords, setTownCoords] = useState(null);
  const [deletedMarkers, setDeletedMarkers] = useState([]);
  const [fallbackData, setFallbackData] = useState(null);

  // configure baseURL
  const baseURL = "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMpigs(updatedMembers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setQ1Loading(false);
      }
    };

    fetchData();
  }, []);

  const fetchMarkers = async () => {
    try {
      const center = location.length > 0 ? location : mapInstance.getCenter();

      console.log("Fetching markers near:", center);

      if (!center) return;
      const response = await axios.get(`${baseURL}/api/police-locations/`, {
        params: {
          latitude: center.lat(),
          longitude: center.lng(),
        },
      });

      console.log("Fetched markers:", response.data);

      if (!response.data.length) {
        throw new Error("No police officers found nearby.");
      }

      const fetchedMarkers = response.data.map((m) => {
        const marker = new google.maps.Marker({
          position: { lat: m.latitude, lng: m.longitude },
          map: mapInstance,
          draggable: editMode,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg baseProfile="basic" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="#6331AE">
              <path d="M42.7 16.2c.3-3.4 1.3-6.6 3.1-9.5l-7-6.7c-2.2 1.8-4.7 2.8-7.6 3-2.6.2-5.1-.2-7.4-1.4-2.3 1.1-4.8 1.6-7.4 1.4-2.7-.2-5.1-1.1-7.2-2.7l-6.9 6.7c1.7 2.9 2.7 6 2.9 9.2.1 1.5-.3 3.5-1.3 6.1-.5 1.5-.9 2.7-1.2 3.8-.2 1-.4 1.9-.4 2.5 0 2.8.8 5.3 2.4 7.5 1.3 1.6 3.5 3.4 6.4 5.4 3.3 1.6 5.8 2.6 7.6 3.1.5.2 1 .4 1.5.7l1.5.6c1.1.6 1.9 1.3 2.3 2.1.5-.8 1.3-1.5 2.4-2.1.7-.3 1.4-.6 1.9-.8.5-.2.9-.4 1.1-.5.4-.2.9-.4 1.5-.6.6-.2 1.4-.5 2.2-.8 1.7-.6 3-1.1 3.8-1.6 2.9-2 5-3.8 6.4-5.3 1.7-2.2 2.6-4.8 2.5-7.6-.1-1.3-.7-3.3-1.7-6.1-1.1-2.8-1.6-4.9-1.4-6.4z"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(28, 28),
            labelOrigin: new google.maps.Point(14, 14),
          },
          label: {
            text: "P",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
          },
        });

        marker.addListener("click", () => {
          if (editMode) {
            marker.setMap(null);
            setMarkers((prevMarkers) =>
              prevMarkers.filter((m) => m.marker !== marker)
            );
            setDeletedMarkers((prev) => [...prev, marker.id]); // Track deleted marker by date_created
          }
        });

        return {
          id: m.date_created,
          marker,
          date_created: m.date_created,
          date_updated: m.date_updated,
        };
      });

      setMarkers((prevMarkers) => {
        const markerMap = new Map(
          prevMarkers.map((marker) => [marker.id, marker])
        );

        fetchedMarkers.forEach((marker) => {
          // Check if the marker already exists
          if (markerMap.has(marker.id)) {
            // If it exists, set the existing marker's map to null
            markerMap.get(marker.id).marker.setMap(null);
          }
          // Add the new marker to the map
          markerMap.set(marker.id, marker);
        });

        // Return the updated markers array
        return Array.from(markerMap.values());
      });
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  const updateMarkers = async () => {
    if (!editMode && !toggleAdd) return;
    try {
      if (!markers.length) return;

      const updatedMarkers = markers.map(
        ({ marker, date_created, date_updated }) => {
          const position = marker.getPosition();
          return {
            label: "police",
            latitude: position.lat(),
            longitude: position.lng(),
            date_created,
            date_updated,
          };
        }
      );

      console.log("Updated markers:", updatedMarkers);
      console.log("Deleted markers:", deletedMarkers);

      const payload = {
        markers: updatedMarkers,
        deletedMarkers: deletedMarkers,
      };
      await axios.post(`${baseURL}/api/police-locations/`, payload);
      setDeletedMarkers([]); // Clear deleted markers after updating
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        toggleAdd,
        setToggleAdd,
        editMode,
        setEditMode,
        markers,
        setMarkers,
        mapInstance,
        setMapInstance,
        location,
        setLocation,
        routeMode,
        setRouteMode,
        nearestMarkersInfo,
        setNearestMarkersInfo,
        mpigs,
        setMpigs,
        q1Loading,
        mapLoaded,
        setMapLoaded,
        townCoords,
        setTownCoords,
        fetchMarkers,
        updateMarkers,
        deletedMarkers,
        setDeletedMarkers,
        fallbackData,
        setFallbackData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
