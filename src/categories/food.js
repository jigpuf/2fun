import React from "react";
import food from "../data/foodList.js";
import Distance from "../utilities/distance.js";

const Food = () => {
  const rowbuilder = food.map((item) => {
    const type = item.type.map((type) => {
      return <li>{type}</li>;
    });
    const distance = (
      <Distance
        latitude={item.location.latitude}
        longitude={item.location.longitude}
      />
    );
    return (
      <tr>
        <td>
          <strong>{item.restaurant}</strong>
        </td>
        <td width="5%">
          <a href={item.url} target="_blank">
            <img width="100%" src="/url.png"></img>
          </a>
        </td>

        <td>
          <ul>{type}</ul>
        </td>

        <td>
          {item.address.country}, {item.address.state}, {item.address.city},
          {item.address.street}
        </td>
        <td>{distance}</td>
      </tr>
    );
  });
  return (
    <div>
      <table class="floating-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>URL</th>

            <th>Type</th>
            <th>Address</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>{rowbuilder}</tbody>
      </table>
    </div>
  );
};
export default Food;
