import React, { createContext, useState, useEffect } from "react";
import updatedMembers from "./data/updated_members.json";

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
