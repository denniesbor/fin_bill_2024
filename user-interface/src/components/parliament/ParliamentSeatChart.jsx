// src/components/ParliamentSeatChart.jsx
import React, { useContext, useRef, useEffect, useState } from "react";
import { select, scaleLinear, extent } from "d3";
import { AppContext } from "../../contextAPI";
import Tooltip from "./Tooltip";

const ParliamentSeatChart = () => {
  const { mpigs, q1Loading } = useContext(AppContext);
  const [width, setWidth] = useState(
    window.innerWidth < 768 ? window.innerWidth : (75 / 100) * window.innerWidth
  );
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(
        window.innerWidth < 768
          ? window.innerWidth
          : (75 / 100) * window.innerWidth
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colorPicker = (vote) => {
    const voteColors = {
      YES: "green",
      NO: "red",
      ABSENT: "yellow",
      unknown: "gray",
    };
    return voteColors[vote] || voteColors.unknown;
  };

  const getXYCoordinates = (height, width, innerRadiusCoef, nSeats) => {
    const outerParliamentRadius = Math.min(width / 2, height);
    const innerParliamentRadius = outerParliamentRadius * 0.4;

    function series(s, n) {
      let r = 0;
      for (let i = 0; i <= n; i++) {
        r += s(i);
      }
      return r;
    }

    let nRows = 0;
    let maxSeatNumber = 0;
    let b = 0.5;
    (function () {
      let a = innerRadiusCoef / (1 - innerRadiusCoef);
      while (maxSeatNumber < nSeats) {
        nRows++;
        b += a;
        maxSeatNumber = series((i) => Math.floor(Math.PI * (b + i)), nRows - 1);
      }
    })();

    const rowWidth = (outerParliamentRadius - innerParliamentRadius) / nRows;
    let seats = [];
    (function () {
      let seatsToRemove = maxSeatNumber - nSeats;
      for (let i = 0; i < nRows; i++) {
        let rowRadius = innerParliamentRadius + rowWidth * (i + 0.5);
        let rowSeats =
          Math.floor(Math.PI * (b + i)) -
          Math.floor(seatsToRemove / nRows) -
          (seatsToRemove % nRows > i ? 1 : 0);
        let anglePerSeat = Math.PI / rowSeats;
        for (let j = 0; j < rowSeats; j++) {
          let s = {};
          s.polar = {
            r: rowRadius,
            theta: -Math.PI + anglePerSeat * (j + 0.5),
          };
          s.cartesian = {
            x: s.polar.r * Math.cos(s.polar.theta),
            y: s.polar.r * Math.sin(s.polar.theta),
          };
          seats.push(s);
        }
      }
    })();

    seats.sort(
      (a, b) => a.polar.theta - b.polar.theta || b.polar.r - a.polar.r
    );

    const x = scaleLinear()
      .domain(extent(seats, (d) => d.cartesian.x))
      .nice()
      .range([width * 0.1, width - width * 0.1]);

    const y = scaleLinear()
      .domain(extent(seats, (d) => d.cartesian.y))
      .nice()
      .range([height * 0.1, height - height * 0.1]);

    const translatedSeats = seats.map((d) => ({
      x: x(d.cartesian.x),
      y: y(d.cartesian.y),
      seatRadius: 0.4 * rowWidth,
    }));

    return translatedSeats;
  };

  const sortMpigs = (mpigs) => {
    const voteOrder = { unknown: 0, YES: 1, NO: 2, ABSENT: 3 };
    return mpigs
      .slice()
      .sort(
        (a, b) =>
          (voteOrder[a.vote || "unknown"] || 0) -
          (voteOrder[b.vote || "unknown"] || 0)
      );
  };

  useEffect(() => {
    if (mpigs.length > 0) {
      const sortedMpigs = sortMpigs(mpigs);
      const svg = select(ref.current);
      const totalPoints = sortedMpigs.length;
      const height = width * 0.6;
      const locations = getXYCoordinates(height, width, 0.4, totalPoints);

      const data = locations.map((coords, i) => ({
        ...coords,
        ...sortedMpigs[i],
        vote: sortedMpigs[i].vote || "unknown",
      }));

      svg.selectAll("*").remove();

      const circles = svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.seatRadius)
        .attr("fill", (d) => colorPicker(d.vote))
        .on("mouseover", (event, d) => {
          setTooltipData(d);
          setTooltipPosition({ x: event.pageX, y: event.pageY });
        })
        .on("mousemove", (event) => {
          setTooltipPosition({ x: event.pageX, y: event.pageY });
        })
        .on("mouseout", () => {
          setTooltipData(null);
        });
    }
  }, [width, mpigs]);

  if (q1Loading) {
    return <div>Loading...</div>;
  }

return (
  <div className="flex flex-col items-center bg-gray-100">
    <h1 className="text-2xl font-bold mb-6 text-center">
      Parliamentary Seat Chart Indicating MPs Voting Patterns - 2024 Financial Bill
    </h1>
    <div className="relative">
      <svg style={{ height: width * 0.6, width: width }} ref={ref}></svg>
      {tooltipData && (
        <Tooltip
          x={tooltipPosition.x}
          y={tooltipPosition.y}
          data={tooltipData}
        />
      )}
    </div>
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
        <span>ABSENT</span>
      </div>
      <div className="flex items-center mx-2">
        <div className="w-4 h-4 bg-gray-500 mr-2"></div>
        <span>UNKNOWN</span>
      </div>
    </div>
  </div>
);

};

export default ParliamentSeatChart;
