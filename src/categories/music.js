import React from "react";
import music from "../data/musicList.js";
import destinations from "../data/destinationList.js";
import Distance from "../utilities/distance.js";

const Music = () => {
  // Sort the destinations array based on the name attribute
  const sortedDestinations = destinations.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return (
    <div>
      <h1>Music</h1>
      <ol>
        {sortedDestinations.map((destination, index) => (
          <li key={index}>{destination.name}</li>
        ))}
      </ol>
    </div>
  );
};

export default Music;
