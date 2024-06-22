import React from "react";
import MapInitializer from "./MapInitializer";
import MarkerComponent from "./PoliceMarkers/MarkerComponent";
import NearestMarkerCalculator from "./PoliceMarkers/NearestMarkerCalculator";
import RouteCalculator from "./RouteCalculator";
import withGoogleMaps from "../utils/withGoogleMaps"; // Import the HOC
import TownContacts from "./TownContacts";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map = ({ onLoad, onError }) => {
  return (
    <div>
      <MapInitializer onLoad={onLoad} onError={onError} />
      <MarkerComponent />
      <NearestMarkerCalculator />
      <RouteCalculator />
      <TownContacts />
    </div>
  );
};

export default withGoogleMaps(Map, GOOGLE_MAPS_API_KEY); // Wrap with HOC
