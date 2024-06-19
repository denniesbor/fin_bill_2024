import React, { useState, useEffect } from "react";
import ContextProvider from "./contextAPI";
import Map from "./components/Map";
import Navbar from "./components/Navbar";
import ReportPolicePhoto from "./components/ReportPolicePhoto";
import Loading from "./components/Loading";
const App = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <ContextProvider>
      {isMapLoaded ? (
        <>
          <Navbar />
          <Map />
          <ReportPolicePhoto />
        </>
      ) : (
        <>
          <Map onLoad={handleMapLoad} />
          <Loading />
        </>
      )}
    </ContextProvider>
  );
};

export default App;