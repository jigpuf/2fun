import React from "react";
import Food from "./categories/food.js";
import Destination from "./categories/destination.js";
import Music from "./categories/music.js";
import People from "./categories/people.js";

const Main = (props) => {
  const activeTab = props.activeTab;
  return (
    <div className="main">
      {activeTab === "food" && <Food />}
      {activeTab === "destination" && <Destination />}
      {activeTab === "music" && <Music />}
      {activeTab === "people" && <People />}
    </div>
  );
};

export default Main;
