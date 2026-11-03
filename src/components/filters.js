import React, { createContext, useContext, useEffect, useState } from "react";
import calculateDistance from "../utilities/calculateDistance.js";

// Shared search + distance filter for every tab (and the map).
// main.js wraps the tabs in <FilterProvider>; PlaceTable and PlaceMap read
// the current values with useFilters(). Without a provider nothing is filtered.

const STORAGE_KEY = "2fun-max-miles";
export const DISTANCE_OPTIONS = [25, 50, 100, 250]; // plus "All"

const FilterContext = createContext({
  search: "",
  setSearch: () => {},
  maxMiles: null,
  setMaxMiles: () => {},
});

export const useFilters = () => useContext(FilterContext);

const loadMaxMiles = () => {
  try {
    const n = Number(localStorage.getItem(STORAGE_KEY));
    return DISTANCE_OPTIONS.includes(n) ? n : null;
  } catch {
    return null;
  }
};

export const FilterProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [maxMiles, setMaxMiles] = useState(loadMaxMiles);

  useEffect(() => {
    try {
      if (maxMiles) localStorage.setItem(STORAGE_KEY, String(maxMiles));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // private mode / storage full: just don't remember it
    }
  }, [maxMiles]);

  return (
    <FilterContext.Provider
      value={{ search, setSearch, maxMiles, setMaxMiles }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Lowercase and strip accents so "cafe" finds "Café"
const fold = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const toArray = (value) =>
  Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];

// Everything searchable about a place, whatever list it came from
const searchText = (item) => {
  const address =
    item.address && typeof item.address === "object" ? item.address : {};
  return fold(
    [
      item.restaurant,
      item.hotel,
      item.name,
      item.category, // set on the Everything tab ("Food", "Park", ...)
      ...toArray(item.type),
      typeof item.city === "string" ? item.city : "",
      address.city,
      address.state,
      address.country,
      item.note,
    ]
      .filter((v) => typeof v === "string" || typeof v === "number")
      .join(" | "),
  );
};

// Every word typed must appear somewhere ("pizza waco" finds pizza in Waco)
export const matchesSearch = (item, search) => {
  const words = fold(search || "")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return true;
  const text = searchText(item);
  return words.every((word) => text.includes(word));
};

export const hasCoords = (item) =>
  Number.isFinite(item?.location?.latitude) &&
  Number.isFinite(item?.location?.longitude);

// Distance in miles, or null if either side is unknown
export const distanceTo = (item, latitude, longitude) =>
  latitude === null || longitude === null || !hasCoords(item)
    ? null
    : calculateDistance(
        latitude,
        longitude,
        item.location.latitude,
        item.location.longitude,
      );

// Applies both filters. With no user location the distance filter is skipped.
export const filterPlaces = (
  items,
  { search, maxMiles, latitude, longitude },
) =>
  (items || []).filter((item) => {
    if (!matchesSearch(item, search)) return false;
    if (!maxMiles) return true;
    const miles = distanceTo(item, latitude, longitude);
    return miles === null || miles <= maxMiles;
  });

// 16px text keeps iPhone Safari from zooming in when the box is tapped
const controlStyle = {
  fontSize: 16,
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #888",
};
const barStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  width: "95%",
  margin: "12px auto 0",
};

// Pass onToggleMap to show a Map/List button at the end of the row
export const FilterBar = ({
  hasLocation = true,
  showMap = false,
  onToggleMap,
}) => {
  const { search, setSearch, maxMiles, setMaxMiles } = useFilters();
  return (
    <div className="filter-bar" style={barStyle}>
      <input
        style={{ ...controlStyle, flex: "1 1 180px" }}
        type="search"
        placeholder="Search name, type, city, notes..."
        aria-label="Search places"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        style={controlStyle}
        aria-label="Maximum distance"
        value={maxMiles || ""}
        onChange={(e) => setMaxMiles(Number(e.target.value) || null)}
        title={hasLocation ? "" : "Waiting for your location; showing all"}
      >
        {DISTANCE_OPTIONS.map((miles) => (
          <option key={miles} value={miles}>
            Within {miles} mi
          </option>
        ))}
        <option value="">Any distance</option>
      </select>
      {onToggleMap && (
        <button
          type="button"
          style={{
            ...controlStyle,
            fontWeight: "bold",
            background: "black",
            color: "white",
          }}
          onClick={onToggleMap}
        >
          {showMap ? "List" : "Map"}
        </button>
      )}
    </div>
  );
};
