import React from "react";
import destinations from "../data/destinationList.js";
import Distance from "../utilities/distance.js";

const Destination = (props) => {
  const rowbuilder = destinations.map((item) => {
    const wants = item.want.map((person) => {
      return (
        <div>
          <img src={person} width="100%"></img>
        </div>
      );
    });
    const been = item.been.map((person) => {
      return (
        <div>
          <img src={person} width="100%"></img>
        </div>
      );
    });
    const type = item.type.map((type) => {
      return <li>{type}</li>;
    });
    const fun = item.activities.map((fun) => {
      return (
        <li>
          {fun.event}-{fun.date}
        </li>
      );
    });
    const distance = (
      <Distance
        latitude={item.location.latitude}
        longitude={item.location.longitude}
      />
    );
    ///////
    return (
      <tr>
        <td>
          <strong>{item.name}</strong>
        </td>
        <td width="5%">
          <a href={item.url} target="_blank">
            <img width="100%" src="/url.png"></img>
          </a>
        </td>
        <td width="5%">{wants}</td>
        <td width="5%">{been}</td>
        <td>
          <ul>{type}</ul>
        </td>
        <td>
          <ul>{fun}</ul>
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
            <th>Wish</th>
            <th>Been</th>
            <th>Type</th>
            <th>Fun</th>
            <th>Address</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>{rowbuilder}</tbody>
      </table>
    </div>
  );
};
export default Destination;
