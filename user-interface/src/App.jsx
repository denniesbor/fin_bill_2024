import React, { useState } from "react";
import { ContextProvider } from "./contextAPI";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import ReportPolicePhoto from "./components/ReportPolicePhoto";
import Loading from "./components/Loading";
import Error from "./components/Error";

const App = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  const handleError = (message) => {
    setError(message);
  };

  return (
    <ContextProvider>
      {error ? (
        <Error message={error} />
      ) : isMapLoaded ? (
        <>
          <Navbar />
          <Map onLoad={handleMapLoad} onError={handleError} />
          <ReportPolicePhoto />
        </>
      ) : (
        <>
          <Map onLoad={handleMapLoad} onError={handleError} />
          <Loading />
        </>
      )}
    </ContextProvider>
  );
};

export default App;
