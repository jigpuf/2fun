import React from "react";
import PlaceTable, { WebsiteLink, List } from "../components/placeTable.js";
import food from "../data/foodList.js";
import destinations from "../data/destinationList.js";
import hotels from "../data/hotelList.js";
import gas from "../data/gasList.js";
import parks from "../data/parkList.js";
import stores from "../data/storeList.js";

// One entry per list. The map uses these too (label, pin color, items).
export const CATEGORIES = {
  food: { label: "Food", color: "#d62728", items: food },
  destination: { label: "Destination", color: "#7b3fb5", items: destinations },
  hotels: { label: "Hotel", color: "#1f6fb4", items: hotels },
  gas: { label: "Gas", color: "#ff7f0e", items: gas },
  parks: { label: "Park", color: "#2a9d2a", items: parks },
  stores: { label: "Store", color: "#8c564b", items: stores },
};

// Lists that make up the Everything tab (and the map's default)
export const EVERYTHING_KEYS = ["food", "destination", "parks", "stores"];

// Name and "City, State" whatever shape the list uses
export const placeName = (item) =>
  item.restaurant || item.hotel || item.name || "";
export const placeCity = (item) =>
  typeof item.city === "string"
    ? item.city
    : [item.address?.city, item.address?.state].filter(Boolean).join(", ");

// Combined list with a common shape; original fields are kept so search works
export const combine = (keys) =>
  keys.flatMap((key) =>
    (CATEGORIES[key].items || []).map((item, i) => ({
      ...item,
      name: placeName(item),
      category: CATEGORIES[key].label,
      categoryKey: key,
      slug: `${key}-${item.slug || i}`,
    })),
  );

const everything = combine(EVERYTHING_KEYS);

const columns = [
  {
    header: "Place",
    render: (item) => (
      <>
        {item.name} <WebsiteLink url={item.url} />
      </>
    ),
  },
  {
    header: "Category",
    render: (item) => (
      <strong style={{ color: CATEGORIES[item.categoryKey].color }}>
        {item.category}
      </strong>
    ),
  },
  { header: "Type", render: (item) => <List items={item.type} ordered /> },
  {
    header: "Where",
    render: (item) => (
      <>
        {placeCity(item)}
        {item.note && (
          <details>
            <summary>Note</summary>
            {item.note}
          </details>
        )}
      </>
    ),
  },
];

const Everything = ({ latitude, longitude }) => (
  <PlaceTable
    items={everything}
    columns={columns}
    latitude={latitude}
    longitude={longitude}
  />
);

export default Everything;
