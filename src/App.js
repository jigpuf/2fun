import React, { useState } from "react";
import Nav from "./nav.js";
import Main from "./main.js";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState(null);

  let openTab = (tab) => {
    return () => {
      setActiveTab(tab);
    };
  };
  return (
    <div className="App">
      <Nav openTab={openTab} activeTab={activeTab} />

      <Main activeTab={activeTab} />
    </div>
  );
}

export default App;
