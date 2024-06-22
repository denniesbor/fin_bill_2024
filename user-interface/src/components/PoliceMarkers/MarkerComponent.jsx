import React, { useEffect, useContext } from "react";
import { AppContext } from "../../contextAPI";

const MarkerComponent = () => {
  const {
    markers,
    setMarkers,
    mapInstance,
    toggleAdd,
    editMode,
    setDeletedMarkers,
  } = useContext(AppContext);

  useEffect(() => {
    if (!mapInstance) return;

    const handleClick = (event) => {
      if (toggleAdd) {
        const markerColor = "#6331AE"; // purple sorta color
        const marker = new google.maps.Marker({
          position: event.latLng,
          map: mapInstance,
          draggable: editMode,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                <svg baseProfile="basic" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="${markerColor}">
                <path d="M42.7 16.2c.3-3.4 1.3-6.6 3.1-9.5l-7-6.7c-2.2 1.8-4.7 2.8-7.6 3-2.6.2-5.1-.2-7.4-1.4-2.3 1.1-4.8 1.6-7.4 1.4-2.7-.2-5.1-1.1-7.2-2.7l-6.9 6.7c1.7 2.9 2.7 6 2.9 9.2.1 1.5-.3 3.5-1.3 6.1-.5 1.5-.9 2.7-1.2 3.8-.2 1-.4 1.9-.4 2.5 0 2.8.8 5.3 2.4 7.5 1.3 1.6 3.5 3.4 6.4 5.4 3.3 1.6 5.8 2.6 7.6 3.1.5.2 1 .4 1.5.7l1.5.6c1.1.6 1.9 1.3 2.3 2.1.5-.8 1.3-1.5 2.4-2.1.7-.3 1.4-.6 1.9-.8.5-.2.9-.4 1.1-.5.4-.2.9-.4 1.5-.6.6-.2 1.4-.5 2.2-.8 1.7-.6 3-1.1 3.8-1.6 2.9-2 5-3.8 6.4-5.3 1.7-2.2 2.6-4.8 2.5-7.6-.1-1.3-.7-3.3-1.7-6.1-1.1-2.8-1.6-4.9-1.4-6.4z"/>
                </svg>
              `),
            scaledSize: new google.maps.Size(28, 28),
            labelOrigin: new google.maps.Point(14, 14),
          },
          label: {
            text: "P",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
          },
        });

        marker.addListener("click", () => {
          if (editMode) {
            marker.setMap(null);
            setMarkers((prevMarkers) =>
              prevMarkers.filter((m) => m.marker !== marker)
            );
            setDeletedMarkers((prev) => [...prev, { date_created: marker.id }]); // Track deleted marker
          }
        });

        setMarkers((prevMarkers) => [
          ...prevMarkers,
          { id: new Date().getTime(), marker },
        ]);
      }
    };

    mapInstance.addListener("click", handleClick);

    return () => {
      google.maps.event.clearListeners(mapInstance, "click");
    };
  }, [mapInstance, toggleAdd, editMode, setMarkers]);

  useEffect(() => {
    markers.forEach(({ marker, date_created }) => {
      marker.setDraggable(editMode);
      google.maps.event.clearListeners(marker, "click"); // Clear existing listeners to avoid stacking
      marker.addListener("click", () => {
        if (editMode) {
          marker.setMap(null);
          setMarkers((prevMarkers) =>
            prevMarkers.filter((m) => m.marker !== marker)
          );
          setDeletedMarkers((prev) => [
            ...prev,
            { date_created: date_created },
          ]); // Track deleted marker using date_created
        }
      });
    });
  }, [markers, editMode, setMarkers]);

  return null;
};

export default MarkerComponent;
