import React, { useContext } from "react";
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
      <h2 className="text-xl">Track cops and report their brutality</h2>
      <div className="flex flex-row items-center space-x-4">
        <label>
          <input type="checkbox" checked={toggleAdd} onChange={toggleAddMode} />
          {toggleAdd ? "Stop Adding" : "Seen a Cop? Add them Here!"}
        </label>
        <label>
          <input type="checkbox" checked={editMode} onChange={toggleEditMode} />
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
      </div>
    </nav>
  );
};

export default Navbar;
