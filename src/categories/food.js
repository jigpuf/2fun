import React, { useEffect, useState } from "react";
import calculateDistance from "../utilities/calculateDistance.js";
import calculateDirection from "../utilities/calculateDirection.js";
import food from "../data/foodList.js";

const Food = (props) => {
  const [array, setArray] = useState([]);
  const latitude = props.latitude;
  const longitude = props.longitude;

  useEffect(() => {
    if (latitude && longitude) {
      const updatedArray = food.map((item) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          item.location.latitude,
          item.location.longitude
        );
        const direction = calculateDirection(
          latitude,
          longitude,
          item.location.latitude,
          item.location.longitude
        );
        return {
          ...item, // Spread the existing attributes of the item
          distance, // Add the new distance attribute
          direction, // Add the new direction attribute
        };
      });

      // Sort the array by distance in ascending order (shortest to longest)
      const sortedArray = updatedArray.sort((a, b) => a.distance - b.distance);

      setArray(sortedArray);
    }
  }, [latitude, longitude]);

  const getCardinalDirection = (angle) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index =
      Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
  };

  const rows = array.map((item) => {
    const types = item.type.map((type) => {
      return <li>{type}</li>;
    });

    const favorites = item.favorites.map((item) => {
      return <li>{item}</li>;
    });
    const nasty = item.nasty.map((item) => {
      return <li>{item}</li>;
    });

    return (
      <tr>
        <td>
          {item.restaurant}{" "}
          <a href={item.url} target="_blank" style={{ float: "right" }}>
            <img src="/url.png" style={{ width: "40px" }}></img>
          </a>
        </td>
        <td>
          <ol>{types}</ol>
        </td>
        <td>
          <details>
            <summary></summary>
            {item.address.street}
            <br />
            {item.address.city}, {item.address.state},<br />
            {item.address.country}
          </details>
        </td>
        <td>
          <details>
            <summary></summary>
            <ol>{favorites}</ol>
          </details>
        </td>
        <td>
          <details>
            <summary></summary>
            <ol>{nasty}</ol>
          </details>
        </td>
        <td>
          {item.direction.toFixed(0)}°|
          <strong>{item.distance.toFixed(0)}</strong>mi.|
          {getCardinalDirection(item.direction)} <br />
          <img
            style={{
              display: "block;",
              width: "20%",
              height: "auto",
              transform: `rotate(${item.direction}deg)`,
              position: "relative",
            }}
            src="/arrow.png"
          ></img>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <table class="floating-table">
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>Type</th>
            <th>Address</th>
            <th>Good</th>
            <th>Nasty</th>
            <th>Distance</th>
          </tr>
        </thead>
        {rows}
      </table>
    </div>
  );
};
export default Food;
