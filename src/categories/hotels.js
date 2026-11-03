import React from "react";
import PlaceTable, { WebsiteLink, Address } from "../components/placeTable.js";
import hotels from "../data/hotelList.js";

const columns = [
  {
    header: "Hotel",
    render: (item) => (
      <>
        {item.hotel} <WebsiteLink url={item.url} />
      </>
    ),
  },
  { header: "Address", render: (item) => <Address address={item.address} /> },
  { header: "Rating", render: (item) => item.rating },
  {
    header: "Note",
    render: (item) => (
      <details>
        <summary></summary>
        {item.note}
      </details>
    ),
  },
];

const Hotels = ({ latitude, longitude }) => (
  <PlaceTable
    items={hotels}
    columns={columns}
    latitude={latitude}
    longitude={longitude}
  />
);

export default Hotels;
