import React from "react";

const NearestMarkerInfo = ({ nearestMarkerInfo }) => {
  if (!nearestMarkerInfo) {
    return null;
  }

  return (
    <div className="bg-blue-100 p-4 rounded shadow-lg mt-4">
      <h3 className="text-lg font-bold">Nearest Police Officers</h3>
      <p>Distance: {(nearestMarkerInfo.distance / 1000).toFixed(2)} km</p>
      <p>Location: {nearestMarkerInfo.position}</p>
    </div>
  );
};

export default NearestMarkerInfo;
