import React from "react";
import PlaceTable, {
  WebsiteLink,
  Address,
  List,
} from "../components/placeTable.js";
import stores from "../data/storeList.js";

const columns = [
  {
    header: "Store",
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

const Stores = ({ latitude, longitude }) => (
  <PlaceTable
    items={stores}
    columns={columns}
    latitude={latitude}
    longitude={longitude}
  />
);

export default Stores;
