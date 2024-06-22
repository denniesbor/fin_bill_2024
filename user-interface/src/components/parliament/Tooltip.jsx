import React from "react";

const Tooltip = ({ x, y, data }) => {
  if (!data) return null;

  return (
    <div
      className="absolute bg-white border border-gray-300 p-4 shadow-lg rounded-lg transform -translate-x-1/2 -translate-y-full pointer-events-none"
      style={{ top: y, left: x }}
    >
      <img
        src={data.image}
        alt={data.name}
        className="w-20 h-20 object-cover rounded-full mb-4 mx-auto"
      />
      <p className="font-bold text-center">{data.name}</p>
      <p className="text-center">
        <strong>Constituency:</strong> {data.constituency}
      </p>
      <p className="text-center">
        <strong>County:</strong> {data.county}
      </p>
      <p className="text-center">
        <strong>Party:</strong> {data.party}
      </p>
      <p className="text-center">
        <strong>Vote:</strong> {data.vote}
      </p>
    </div>
  );
};

export default Tooltip;
