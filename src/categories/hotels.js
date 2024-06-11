import React, { useEffect, useState } from "react";
import calculateDistance from "../utilities/calculateDistance.js";
import calculateDirection from "../utilities/calculateDirection.js";
import hotels from "../data/hotelList.js";
const Hotels = (props) => {
  const [array, setArray] = useState([]);
  const latitude = props.latitude;
  const longitude = props.longitude;

  useEffect(() => {
    if (latitude && longitude) {
      const updatedArray = hotels.map((item) => {
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
    return (
      <tr>
        <td>
          {item.hotel}{" "}
          <a href={item.url} target="_blank" style={{ float: "right" }}>
            <img src="/url.png" style={{ width: "40px" }}></img>
          </a>
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
        <td>{item.rating}</td>
        <td>
          <details>
            {" "}
            <summary></summary>
            {item.note}
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
            <th>Hotel</th>
            <th>Address</th>
            <th>Rating</th>
            <th>Note</th>
            <th>Distance</th>
          </tr>
        </thead>
        {rows}
      </table>
    </div>
  );
};
export default Hotels;
