import React from "react";

const Error = ({ message }) => {
  return (
    <div className="error-container p-4 bg-red-200 text-red-800 rounded-md">
      <p>{message}</p>
      <p>
        Please ensure that your browser has permission to access your location.
        If you have denied the request, you may need to update your browser
        settings or refresh the page and allow location access when prompted.
      </p>
    </div>
  );
};

export default Error;
