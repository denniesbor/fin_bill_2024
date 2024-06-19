import React from "react";
import ContextProvider from "./contextAPI";
import Map from "./components/Map";
import Navbar from "./components/Navbar";
import ReportPolicePhoto from "./components/ReportPolicePhoto";

const App = () => {
  return (
    <ContextProvider  >
      <Navbar />
      <Map />
      <ReportPolicePhoto />
    </ContextProvider>
  );
};

export default App;
