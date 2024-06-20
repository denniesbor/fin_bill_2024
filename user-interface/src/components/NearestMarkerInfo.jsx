import React from "react";

const NearestMarkerInfo = ({ nearestMarkersInfo }) => {
  if (!nearestMarkersInfo || nearestMarkersInfo.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-100 p-4 rounded shadow-lg mt-4">
      <h3 className="text-lg font-bold">Nearby Police Officers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearestMarkersInfo.map((markerInfo, index) => (
          <div key={index} className="bg-white p-3 rounded shadow-md">
            <p className="text-gray-700">
              <strong>Distance:</strong>{" "}
              {(markerInfo.distance / 1000).toFixed(2)} km
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> {markerInfo.position}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearestMarkerInfo;
