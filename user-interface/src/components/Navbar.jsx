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

    </nav>
  );
};

export default Navbar;
