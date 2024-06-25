import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../../contextAPI";

const FileUpload = () => {
  const { fallbackData, setLocation, location, isLoading, baseURL } =
    useContext(AppContext);
  const [file, setFile] = useState(null);
  const [selectedTown, setSelectedTown] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
          },
          (err) => {
            console.log(
              "Location access denied. Please enable location services."
            );
            setLocationDenied(true);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTownChange = (e) => {
    setSelectedTown(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (!location && !selectedTown) {
      setError("Please select a location.");
      return;
    }

    setIsSubmitting(true); // Change button state to submitting
    const formData = new FormData();
    formData.append("file", file);
    const finalLocation =
      location || selectedTown || Object.values(fallbackData)[0];
    formData.append("location", JSON.stringify(finalLocation));
    try {
      const response = await axios.post(`${baseURL}/api/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsSubmitting(false); // Revert button state after submission
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8 p-4 bg-gray-100">
      <h1 className="text-lg font-bold mb-4 text-center">
        Have you spotted and recorded a police officer unconstitutionally using
        unnecessary force on protesters? Please report here!
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md w-64"
      >
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Click to select file
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {locationDenied && fallbackData && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Location is turned off. Please select a town:
            </label>
            <select
              value={selectedTown}
              onChange={handleTownChange}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a town</option>
              {Object.keys(fallbackData).map((key) => (
                <option
                  key={key}
                  value={key.charAt(0).toUpperCase() + key.slice(1)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
            {isLoading && <p>Loading towns...</p>}
          </div>
        )}
        {error && <div className="mb-3 text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-1 px-2 rounded hover:bg-indigo-700"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
