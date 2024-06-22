import React from "react";
import MapInitializer from "./MapInitializer";
import MarkerComponent from "./MarkerComponent";
import NearestMarkerCalculator from "./NearestMarkerCalculator";
import NearestMarkerInfo from "./NearestMarkerInfo";
import RouteCalculator from "./RouteCalculator";
import { useContext } from "react";
import { AppContext } from "../contextAPI";

const Map = ({ onLoad, onError }) => {
  const { nearestMarkersInfo } = useContext(AppContext);

  return (
    <div>
      <MapInitializer onLoad={onLoad} onError={onError} />
      <MarkerComponent />
      <NearestMarkerCalculator />
      <NearestMarkerInfo nearestMarkersInfo={nearestMarkersInfo} />
      <RouteCalculator />
    </div>
  );
};

export default Map;
