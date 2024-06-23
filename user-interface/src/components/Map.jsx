import React, {useContext} from "react";
import MapInitializer from "./MapInitializer";
import MarkerComponent from "./PoliceMarkers/MarkerComponent";
import NearestMarkerCalculator from "./PoliceMarkers/NearestMarkerCalculator";
import RouteCalculator from "./RouteCalculator";
import withGoogleMaps from "../utils/withGoogleMaps"; // Import the HOC
import TownContacts from "./TownContacts";
import { AppContext } from "../contextAPI";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map = ({ onLoad, onError }) => {

  const { mapLoaded, toggleAdd, editMode, routeMode, fetchMarkers, updateMarkers, setEditMode, setToggleAdd, setRouteMode } = useContext(AppContext);

  const toggleAddMode = () => {
    setToggleAdd(!toggleAdd);
    setEditMode(false);
    setRouteMode(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setToggleAdd(false);
    setRouteMode(false);
  };

  const toggleRouteMode = () => {
    setRouteMode(!routeMode);
    setToggleAdd(false);
    setEditMode(false);
  };

  const renderCheckbox = (checked, onChange, text) => (
    <label className="flex items-center space-x-2 text-sm mx-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span>{text}</span>
    </label>
  );
  return (
    <div>
      <div>
        <p className="text-center text-sm m-2">
          A sub-page that manages crowd-sourced data on police presence in an
          area. Please enable device location access to pinpoint you to your
          precise location. If you have spotted police presence in your area,
          please drag and drop (first toggle add) and update locs. To edit their
          movements, please toggle edit, drag/remove if they are no longer in
          place. At the moment, I am unsure of routing (it worked where I am).
        </p>
        <hr className="w-full border-t border-gray-300" />
        {mapLoaded && (
          <div className="w-full flex flex-row justify-around space-x-2 m-2">
            {renderCheckbox(
              toggleAdd,
              toggleAddMode,
              toggleAdd ? "Stop Adding" : "Seen a Cop? Add them Here!"
            )}
            {renderCheckbox(
              editMode,
              toggleEditMode,
              editMode ? "Stop Editing" : "Edit Cops"
            )}
            {renderCheckbox(
              routeMode,
              toggleRouteMode,
              routeMode ? "Stop Route" : "Find Route to Nearest Cops"
            )}
          </div>
        )}
        <hr className="w-full border-t border-gray-300" />
        {mapLoaded && (
          <div className="w-full my-2 flex flex-row justify-around">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded shadow-md hover:bg-red-300"
              onClick={fetchMarkers}
            >
              Find Nearby Police
            </button>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded shadow-md hover:bg-blue-200"
              onClick={updateMarkers}
            >
              Update Police Loc
            </button>
          </div>
        )}
      </div>

      <div>
        <MapInitializer onLoad={onLoad} onError={onError} />
        <MarkerComponent />
        <NearestMarkerCalculator />
        <RouteCalculator />
        <TownContacts />
      </div>
    </div>
  );
};

export default withGoogleMaps(Map, GOOGLE_MAPS_API_KEY); // Wrap with HOC
