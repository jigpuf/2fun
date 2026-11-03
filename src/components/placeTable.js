import React, { useMemo } from "react";
import calculateDistance from "../utilities/calculateDistance.js";
import calculateDirection from "../utilities/calculateDirection.js";
import { useFilters, filterPlaces, hasCoords } from "./filters.js";

// Apple devices open Apple Maps; everything else opens Google Maps
const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);

export const directionsUrl = (lat, lng) =>
  isApple
    ? `https://maps.apple.com/?daddr=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

const getCardinalDirection = (angle) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((((angle % 360) + 360) % 360) / 45) % 8;
  return directions[index];
};

// Reusable pieces the tab files can use in their columns
export const WebsiteLink = ({ url }) =>
  url ? (
    <a href={url} target="_blank" rel="noreferrer" style={{ float: "right" }}>
      <img src="/url.png" alt="Website" style={{ width: "40px" }} />
    </a>
  ) : null;

export const Address = ({ address }) => (
  <details>
    <summary></summary>
    {address.street}
    <br />
    {address.city}, {address.state},<br />
    {address.country}
  </details>
);

export const List = ({ items, ordered }) => {
  const rows = (items || [])
    .filter(Boolean)
    .map((text, i) => <li key={i}>{text}</li>);
  return ordered ? <ol>{rows}</ol> : <ul>{rows}</ul>;
};

// columns: [{ header: "Name", render: (item) => <jsx /> }, ...]
// A Distance column with the arrow and directions link is added at the end.
// The search box and distance picker (filters.js) apply automatically;
// pass search / maxMiles props to override them for one table.
const PlaceTable = ({
  items,
  columns,
  latitude,
  longitude,
  search,
  maxMiles,
}) => {
  const filters = useFilters();
  const activeSearch = search ?? filters.search;
  const activeMaxMiles = maxMiles ?? filters.maxMiles;
  const hasLocation = latitude !== null && longitude !== null;

  const sorted = useMemo(() => {
    const placed = items.filter(hasCoords);
    // No location yet (or it was denied): show everything in list order
    if (!hasLocation) return placed;
    return placed
      .map((item) => ({
        ...item,
        distance: calculateDistance(
          latitude,
          longitude,
          item.location.latitude,
          item.location.longitude,
        ),
        direction: calculateDirection(
          latitude,
          longitude,
          item.location.latitude,
          item.location.longitude,
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [items, latitude, longitude, hasLocation]);

  const shown = useMemo(
    () =>
      filterPlaces(sorted, {
        search: activeSearch,
        maxMiles: activeMaxMiles,
        latitude,
        longitude,
      }),
    [sorted, activeSearch, activeMaxMiles, latitude, longitude],
  );

  return (
    <div>
      {shown.length < sorted.length && (
        <p style={{ width: "95%", margin: "8px auto 0" }}>
          Showing {shown.length} of {sorted.length}
        </p>
      )}
      <table className="floating-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header}>{col.header}</th>
            ))}
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1}>No places match.</td>
            </tr>
          )}
          {shown.map((item, i) => (
            <tr key={`${item.slug}-${i}`}>
              {columns.map((col) => (
                <td key={col.header}>{col.render(item)}</td>
              ))}
              <td>
                {hasLocation && (
                  <>
                    {item.direction.toFixed(0)}°|
                    <strong>{item.distance.toFixed(0)}</strong>mi.|
                    {getCardinalDirection(item.direction)} <br />
                  </>
                )}
                <a
                  href={directionsUrl(
                    item.location.latitude,
                    item.location.longitude,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "block" }}
                >
                  <img
                    src="/arrow.png"
                    alt="Directions"
                    style={{
                      display: "block",
                      width: "20%",
                      height: "auto",
                      transform: `rotate(${hasLocation ? item.direction : 0}deg)`,
                      position: "relative",
                    }}
                  />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaceTable;
