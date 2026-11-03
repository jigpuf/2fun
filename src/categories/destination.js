import React from "react";
import PlaceTable, {
  WebsiteLink,
  Address,
  List,
} from "../components/placeTable.js";
import destinations from "../data/destinationList.js";

const Activities = ({ activities }) => {
  const list = (activities || []).filter((a) => a && a.event);
  if (list.length === 0) return null;
  return (
    <details>
      <summary>Things to do</summary>
      <ul>
        {list.map((a, i) => (
          <li key={i}>
            {a.event}
            {a.date ? ` (${a.date})` : ""}
          </li>
        ))}
      </ul>
    </details>
  );
};

const columns = [
  {
    header: "Location",
    render: (item) => (
      <>
        {item.name} <WebsiteLink url={item.url} />
        <br />
        <Activities activities={item.activities} />
      </>
    ),
  },
  { header: "Type", render: (item) => <List items={item.type} ordered /> },
  { header: "Address", render: (item) => <Address address={item.address} /> },
];

const Destination = ({ latitude, longitude }) => (
  <PlaceTable
    items={destinations}
    columns={columns}
    latitude={latitude}
    longitude={longitude}
  />
);

export default Destination;
