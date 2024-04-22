import React, { useState } from "react";
import Food from "./categories/food.js";
import Destination from "./categories/destination.js";
import Music from "./categories/music.js";
import People from "./categories/people.js";

const Main = (props) => {
  const [inputValue, setInputValue] = useState(500); // Initialize input value
  let handleInputChange = (event) => {
    setInputValue(Number(event.target.value)); // Convert input value to a number
  };
  const activeTab = props.activeTab;
  return (
    <div className="main">
      <input type="number" value={inputValue} onChange={handleInputChange} />
      Miles
      {activeTab === "food" && <Food inputValue={inputValue} />}
      {activeTab === "destination" && <Destination inputValue={inputValue} />}
      {activeTab === "music" && <Music />}
      {activeTab === "people" && <People />}
    </div>
  );
};

export default Main;
