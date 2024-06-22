import React, { useContext } from "react";
import { AppContext } from "../contextAPI";

function TownContacts() {
  const { fallbackData } = useContext(AppContext);

  if (!fallbackData) return null;

  return (
    <div className="container mx-auto p-2 mt-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        Which town are you in? Reach out to one of the following contacts:
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {Object.keys(fallbackData).map((town) => (
          <div
            key={town}
            className="bg-white shadow-sm rounded-lg p-4 max-w-xs mx-auto"
          >
            <h3 className="text-lg font-semibold mb-1">
              {town.charAt(0).toUpperCase() + town.slice(1)}
            </h3>
            <p className="text-sm mb-1">
              <span className="font-semibold">Contact:</span>{" "}
              {fallbackData[town].contact}
            </p>
            <p className="text-sm mb-1">
              <span className="font-semibold">GPS:</span>{" "}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${fallbackData[town].gps[0]},${fallbackData[town].gps[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Location
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TownContacts;
