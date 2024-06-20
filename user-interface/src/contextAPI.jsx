import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [toggleAdd, setToggleAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [location, setLocation] = useState([]);
  const [routeMode, setRouteMode] = useState(false);
  const [nearestMarkersInfo, setNearestMarkersInfo] = useState([]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
