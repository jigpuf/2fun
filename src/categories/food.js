import React from "react";
import food from "../data/foodList.js";

const Food = () => {
  const latitude = 37.33182;
  const longitude = -122.03118;
  return (
    <div>
      <a href={`http://maps.apple.com/?ll=${latitude},${longitude}`}>maps</a>
    </div>
  );
};
export default Food;
