import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ContextProvider } from "./contextAPI";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import ReportPolicePhoto from "./components/ReportPolicePhoto";
import Loading from "./components/Loading";
import Error from "./components/Error";
import ParliamentSeatChart from "./components/parliament/ParliamentSeatChart";
import VotingMap from "./components/parliament/VotingMap";

const App = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  const handleError = (message) => {
    setError(message);
  };

  const router = createBrowserRouter([
    {
      path: "/fin_bill_2024/", // Home page
      element: (
        <div className="p-4">
          <Navbar />
          <ParliamentSeatChart />
          <VotingMap />
        </div>
      ),
    },
    {
      path: "/fin_bill_2024/edit-police",
      element: error ? (
        <Error message={error} />
      ) : isMapLoaded ? (
        <>
          <Navbar />
          <Map onLoad={handleMapLoad} onError={handleError} />
          <ReportPolicePhoto />
        </>
      ) : (
        <>
          <Navbar />
          <Map onLoad={handleMapLoad} onError={handleError} />
          <Loading />
        </>
      ),
    },
  ]);

  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
};

export default App;
