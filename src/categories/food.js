import React from "react";
import PlaceTable, {
  WebsiteLink,
  Address,
  List,
} from "../components/placeTable.js";
import food from "../data/foodList.js";

const columns = [
  {
    header: "Restaurant",
    render: (item) => (
      <>
        {item.restaurant} <WebsiteLink url={item.url} />
      </>
    ),
  },
  { header: "Type", render: (item) => <List items={item.type} ordered /> },
  { header: "Address", render: (item) => <Address address={item.address} /> },
  {
    header: "Good",
    render: (item) => (
      <details>
        <summary></summary>
        <List items={item.favorites} ordered />
      </details>
    ),
  },
  {
    header: "Nasty",
    render: (item) => (
      <details>
        <summary></summary>
        <List items={item.nasty} ordered />
      </details>
    ),
  },
];

const Food = ({ latitude, longitude }) => (
  <PlaceTable
    items={food}
    columns={columns}
    latitude={latitude}
    longitude={longitude}
  />
);

export default Food;
