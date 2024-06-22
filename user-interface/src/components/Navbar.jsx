import React, { useContext } from "react";
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

  return (
    <nav className="w-full bg-blue-100 p-4 text-black flex flex-col justify-between items-center">
      <h1 className="text-2xl font-bold">
        Overview of the 2024 Financial Bill
      </h1>
      <div className="flex flex-row items-center space-x-4 mt-2">
        <Link
          to="/"
          className="bg-white text-blue-600 px-4 py-2 rounded"
        >
          Home
        </Link>
        <Link
          to="/edit-police"
          className="bg-white text-blue-600 px-4 py-2 rounded"
        >
          Edit Police
        </Link>
        {editMode && (
          <>
            <label>
              <input
                type="checkbox"
                checked={toggleAdd}
                onChange={toggleAddMode}
              />
              {toggleAdd ? "Stop Adding" : "Seen a Cop? Add them Here!"}
            </label>
            <label>
              <input
                type="checkbox"
                checked={editMode}
                onChange={toggleEditMode}
              />
              {editMode ? "Stop Editing" : "Edit Cops"}
            </label>
            <label>
              <input
                type="checkbox"
                checked={routeMode}
                onChange={toggleRouteMode}
              />
              {routeMode ? "Stop Route" : "Find Route to Nearest Cops"}
            </label>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
