import React from "react";
import { AppContext } from "../../contextAPI";
import { useContext } from "react";

const NearestMarkerInfo = () => {
  const { nearestMarkersInfo } = useContext(AppContext);

  if (!nearestMarkersInfo || nearestMarkersInfo.length === 0) {
    console.log("No nearby markers found");
    return null;
  }

  return (
    <div className="bg-blue-100 p-4 rounded shadow-lg mt-4">
      <h3 className="text-sm font-bold">Nearby Police Officers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearestMarkersInfo.map((markerInfo, index) => (
          <div key={index} className="bg-white p-1 rounded shadow-md">
            <p className="text-gray-700 text-sm">
              <strong>Distance:</strong>{" "}
              {(markerInfo.distance / 1000).toFixed(2)} km
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Location:</strong> {markerInfo.position}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearestMarkerInfo;
