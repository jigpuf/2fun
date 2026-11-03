import React from "react";
import PlaceTable from "../components/placeTable.js";
import gas from "../data/gasList.js";

const columns = [
  { header: "Station", render: (item) => item.name },
  {
    header: "City",
    render: (item) => (
      <>
        {item.city}
        <details>
          <summary></summary>
          {item.note}
        </details>
      </>
    ),
  },
];

const Gas = ({ latitude, longitude }) => (
  <PlaceTable
    items={gas}
    columns={columns}
    latitude={latitude}
    longitude={longitude}
  />
);

export default Gas;
