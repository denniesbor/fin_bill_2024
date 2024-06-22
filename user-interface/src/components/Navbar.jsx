import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../contextAPI";

const Navbar = () => {
  const {
    toggleAdd,
    setToggleAdd,
    editMode,
    setEditMode,
    routeMode,
    setRouteMode,
    mapLoaded,
    fetchMarkers,
    updateMarkers,
  } = useContext(AppContext);

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
    <nav className="w-full bg-blue-100 text-black flex flex-col justify-between items-center">
      <div className="w-full flex justify-between items-center mt-2 px-2">
        <Link
          to="/"
          className="bg-white text-blue-600 px-2 py-1 rounded shadow-md hover:bg-blue-50"
        >
          Home
        </Link>
        <Link
          to="/edit-police"
          className="bg-white text-blue-600 px-2 py-1 rounded shadow-md hover:bg-blue-50"
        >
          Edit Police
        </Link>
      </div>
      <hr className="w-full border-t border-gray-300 my-2" />
      <p className="text-center text-sm mt-1">
        A sub-page that manages crowd-sourced data on police presence in an
        area. Please enable device location access to pinpoint you to your
        precise location. If you have spotted police presence in your area,
        please drag and drop (first toggle add) and update locs. To edit their
        movements, please toggle edit, drag/remove if they are no longer in
        place. At the moment, I am unsure of routing (it worked where I am).
      </p>
      <hr className="w-full border-t border-gray-300" />
      {mapLoaded && (
        <div className="flex flex-col items-center space-y-2 m-2">
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
          <button className="bg-red-500 text-white px-2 py-1 rounded shadow-md hover:bg-red-300">
            Find Nearby Police
          </button>
          <button className="bg-blue-500 text-white px-2 py-1 rounded shadow-md hover:bg-blue-200">
            Update Police Loc
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
