import React, { useEffect, useState } from "react";

// Atlas Obscura: /search?lat=..&lng=.. lists places nearest first.
// RoadsideAmerica: no coordinate URL, so we look up the town with Nominatim
// and open its town map (covers roughly 60-75 miles). US only.

const RA_BASE = "https://www.roadsideamerica.com";

const ExploreNearby = ({ latitude, longitude }) => {
  const [place, setPlace] = useState(null); // { city, state } or null
  const [lookupDone, setLookupDone] = useState(false);

  const hasLocation = latitude !== null && longitude !== null;

  useEffect(() => {
    if (!hasLocation) return;
    let cancelled = false;
    setLookupDone(false);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const a = data.address || {};
        const iso = a["ISO3166-2-lvl4"] || ""; // e.g. "US-TX"
        const state =
          a.country_code === "us" && iso.startsWith("US-") ? iso.slice(3) : "";
        const city = a.city || a.town || a.village || a.hamlet || "";
        setPlace(state ? { city, state } : null);
      })
      .catch(() => !cancelled && setPlace(null))
      .finally(() => !cancelled && setLookupDone(true));
    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, hasLocation]);

  if (!hasLocation) return null;

  const lat = latitude.toFixed(5);
  const lng = longitude.toFixed(5);
  const atlasUrl = `https://www.atlasobscura.com/search?lat=${lat}&lng=${lng}`;

  let roadsideUrl = null;
  if (place && place.city) {
    roadsideUrl = `${RA_BASE}/search/map?city=${encodeURIComponent(
      place.city,
    )}&state=${place.state}`;
  } else if (place) {
    roadsideUrl = `${RA_BASE}/map/${place.state.toLowerCase()}`;
  }

  const buttonStyle = {
    display: "inline-block",
    margin: "6px 10px 6px 0",
    padding: "10px 18px",
    border: "2px solid #000",
    borderRadius: 8,
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    textDecoration: "none",
  };
  return (
    <div className="explore-nearby">
      <h3>Explore nearby</h3>
      <a
        href={atlasUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
      >
        Atlas Obscura
      </a>
      {roadsideUrl ? (
        <a
          href={roadsideUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
        >
          Roadside America{place && place.city ? ` (${place.city})` : ""}
        </a>
      ) : (
        <span style={{ ...buttonStyle, opacity: 0.5 }}>
          Roadside America {lookupDone ? "(US only)" : "(finding town...)"}
        </span>
      )}
    </div>
  );
};

export default ExploreNearby;
