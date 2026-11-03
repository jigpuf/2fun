import React from "react";
import PlaceTable, {
  WebsiteLink,
  Address,
  List,
} from "../components/placeTable.js";
import parks from "../data/parkList.js";

const columns = [
  {
    header: "Park",
    render: (item) => (
      <>
        {item.name} <WebsiteLink url={item.url} />
      </>
    ),
  },
  { header: "Type", render: (item) => <List items={item.type} ordered /> },
  { header: "Address", render: (item) => <Address address={item.address} /> },
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

const Parks = ({ latitude, longitude }) => (
  <PlaceTable
    items={parks}
    columns={columns}
    latitude={latitude}
    longitude={longitude}
  />
);

export default Parks;
