import React, { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useFilters, filterPlaces, hasCoords } from "./filters.js";
import { directionsUrl } from "./placeTable.js";
import {
  CATEGORIES,
  EVERYTHING_KEYS,
  combine,
  placeCity,
} from "../categories/everything.js";

// Map of the current tab's places (Everything when no list tab is open).
// Uses circle markers, so Leaflet's default marker images (which break with
// bundlers) are never needed. Same search + distance filters as the tables.

const USA_CENTER = [39.5, -98.35];

const link = (href, text) => {
  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.rel = "noreferrer";
  a.textContent = text;
  a.style.marginRight = "12px";
  return a;
};

// Popup built from DOM nodes (textContent), so names/notes can't inject HTML
const popupContent = (item) => {
  const div = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = item.name;
  const info = document.createElement("div");
  info.textContent = [item.category, placeCity(item)]
    .filter(Boolean)
    .join(" · ");
  div.append(name, info);
  const links = document.createElement("div");
  links.style.marginTop = "6px";
  if (/^https?:\/\//i.test(item.url || ""))
    links.append(link(item.url, "Website"));
  links.append(
    link(
      directionsUrl(item.location.latitude, item.location.longitude),
      "Directions",
    ),
  );
  div.append(links);
  return div;
};

const PlaceMap = ({ latitude, longitude, activeTab }) => {
  const { search, maxMiles } = useFilters();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const placesLayerRef = useRef(null);
  const userLayerRef = useRef(null);
  const hasLocation = latitude !== null && longitude !== null;

  const keys =
    CATEGORIES[activeTab] && activeTab !== "everything"
      ? [activeTab]
      : EVERYTHING_KEYS;
  const keyString = keys.join(",");

  const places = useMemo(
    () =>
      filterPlaces(combine(keyString.split(",")).filter(hasCoords), {
        search,
        maxMiles,
        latitude,
        longitude,
      }),
    [keyString, search, maxMiles, latitude, longitude],
  );

  // Create the map once
  useEffect(() => {
    const map = L.map(containerRef.current).setView(USA_CENTER, 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    placesLayerRef.current = L.layerGroup().addTo(map);
    userLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // "You are here" dot
  useEffect(() => {
    const layer = userLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    if (!hasLocation) return;
    L.circleMarker([latitude, longitude], {
      radius: 9,
      color: "white",
      weight: 3,
      fillColor: "#1a73e8",
      fillOpacity: 1,
    })
      .bindTooltip("You are here")
      .addTo(layer);
  }, [latitude, longitude, hasLocation]);

  // Place pins, then zoom to fit them (and you)
  useEffect(() => {
    const map = mapRef.current;
    const layer = placesLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    places.forEach((item) => {
      L.circleMarker([item.location.latitude, item.location.longitude], {
        radius: 8,
        color: "white",
        weight: 2,
        fillColor: CATEGORIES[item.categoryKey].color,
        fillOpacity: 0.9,
      })
        .bindPopup(() => popupContent(item))
        .addTo(layer);
    });

    const points = places.map((p) => [
      p.location.latitude,
      p.location.longitude,
    ]);
    if (hasLocation) points.push([latitude, longitude]);
    if (points.length > 1)
      map.fitBounds(points, { padding: [30, 30], maxZoom: 13 });
    else if (points.length === 1) map.setView(points[0], 11);
  }, [places, latitude, longitude, hasLocation]);

  return (
    <div style={{ width: "95%", margin: "12px auto" }}>
      <div
        ref={containerRef}
        style={{ height: "70vh", minHeight: 300, borderRadius: 8 }}
        aria-label="Map of places"
      />
      <div style={{ marginTop: 6, color: "white" }}>
        {keys.map((key) => (
          <span key={key} style={{ marginRight: 12, whiteSpace: "nowrap" }}>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: CATEGORIES[key].color,
                border: "2px solid white",
                verticalAlign: "middle",
                marginRight: 4,
              }}
            />
            {CATEGORIES[key].label}
          </span>
        ))}
        <span style={{ whiteSpace: "nowrap" }}>
          · {places.length} place{places.length === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
};

export default PlaceMap;
