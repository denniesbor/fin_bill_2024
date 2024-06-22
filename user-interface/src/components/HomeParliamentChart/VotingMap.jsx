import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../../contextAPI";
import VotingPatternTable from "./VotingPatternsTable";
import { cleanFilename } from "../../utils/helpers";
import withGoogleMaps from "../../utils/withGoogleMaps"; // Import the HOC
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const VotingMap = () => {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const { mpigs } = useContext(AppContext);

  const colorPicker = (vote) => {
    const voteColors = {
      YES: "green",
      NO: "red",
      ABSTAIN: "yellow",
      UNKNOWN: "gray",
      ABSENT: "blue",
    };
    return voteColors[vote] || voteColors.UNKNOWN;
  };

  const initializeMap = () => {
    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat: -1.2921, lng: 36.8219 }, // Center the map to Nairobi, Kenya
      zoom: 7,
    });
    setMapInstance(map);

    const infoWindowInstance = new google.maps.InfoWindow();
    setInfoWindow(infoWindowInstance);
  };

  useEffect(() => {
    if (mapInstance && infoWindow) {
      fetch(
        "https://raw.githubusercontent.com/denniesbor/fin_bill_2024/staging/py_nbs/data/merged_mps.geojson"
      )
        .then((response) => response.json())
        .then((data) => {
          mapInstance.data.addGeoJson(data);

          mapInstance.data.setStyle((feature) => {
            const vote = feature.getProperty("vote") || "UNKNOWN";
            return {
              fillColor: colorPicker(vote),
              strokeColor: "black",
              strokeWeight: 1,
              fillOpacity: 0.6,
            };
          });

          mapInstance.data.addListener("click", (event) => {
            const feature = event.feature;
            const constituency = cleanFilename(
              feature.getProperty("constituency")
            );
            const county = cleanFilename(feature.getProperty("county"));
            const name = cleanFilename(feature.getProperty("name"));
            let imageUrl = feature.getProperty("image");

            if (!imageUrl) {
              imageUrl = `/images/${constituency}_${county}_${name}.jpg`;
            }

            const contentString = `
              <div>
                <img src="${imageUrl}" alt="${feature.getProperty(
              "name"
            )}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;" />
                <h3>${feature.getProperty("name")}</h3>
                <p><strong>Constituency:</strong> ${feature.getProperty(
                  "constituency"
                )}</p>
                <p><strong>County:</strong> ${feature.getProperty("county")}</p>
                <p><strong>Party:</strong> ${feature.getProperty("party")}</p>
                <p><strong>Vote:</strong> ${feature.getProperty("vote")}</p>
              </div>
            `;
            infoWindow.setContent(contentString);
            infoWindow.setPosition(event.latLng);
            infoWindow.open(mapInstance);
          });

          // Close InfoWindow on clicking elsewhere on the map
          mapInstance.addListener("click", () => {
            infoWindow.close();
          });
        })
        .catch((error) => console.error("Error loading GeoJSON data:", error));
    }
  }, [mapInstance, infoWindow]);

  useEffect(() => {
    initializeMap();
  }, []);

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-6 pt-2 text-center">
        Geospatial View of the Members of Parliament Voting Patterns - 2024
        Financial Bill
      </h1>
      <div ref={mapContainerRef} style={{ height: "80vh", width: "100%" }} />
      <div className="flex justify-center mt-4">
        <div className="flex items-center mx-2">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span>YES</span>
        </div>
        <div className="flex items-center mx-2">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span>NO</span>
        </div>
        <div className="flex items-center mx-2">
          <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
          <span>ABSTAIN</span>
        </div>
        <div className="flex items-center mx-2">
          <div className="w-4 h-4 bg-gray-500 mr-2"></div>
          <span>UNKNOWN</span>
        </div>
        <div className="flex items-center mx-2">
          <div className="w-4 h-4 bg-blue-500 mr-2"></div>
          <span>ABSENT</span>
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-600 text-center">From Sam Otieno</p>
      <VotingPatternTable data={mpigs} />
    </div>
  );
};

export default withGoogleMaps(VotingMap, GOOGLE_MAPS_API_KEY); // Wrap with HOC
