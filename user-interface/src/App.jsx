import React, { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { ContextProvider } from "./contextAPI";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import ParliamentSeatChart from "./components/HomeParliamentChart/ParliamentSeatChart";
import VotingMap from "./components/HomeParliamentChart/VotingMap";
import withGoogleMaps from "./utils/withGoogleMaps";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MapWithGoogleMaps = withGoogleMaps(Map, GOOGLE_MAPS_API_KEY);

const ParliamentVotingMapWithGoogleMaps = withGoogleMaps(
  VotingMap,
  GOOGLE_MAPS_API_KEY
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <div key={location.pathname}>
      <RouterProvider router={router} />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="p-4">
        <Navbar />
        <ParliamentSeatChart />
        <ParliamentVotingMapWithGoogleMaps />
      </div>
    ),
  },
  {
    path: "/fin_bill_2024",
    element: (
      <div className="p-4">
        <Navbar />
        <ParliamentSeatChart />
        <ParliamentVotingMapWithGoogleMaps />
      </div>
    ),
  },
  {
    path: "/edit-police",
    element: (
      <div className="p-4">
        <Navbar />
        <MapWithGoogleMaps />
      </div>
    ),
  },
]);

const App = () => {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
};

export default App;
