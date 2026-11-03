import React, { useEffect, useState } from "react";
import City from "./utilities/city.js";
import Food from "./categories/food.js";
import Hotels from "./categories/hotels.js";
import Destination from "./categories/destination.js";
import Gas from "./categories/gas.js";
import Parks from "./categories/parks.js";
import Stores from "./categories/stores.js";
import Everything from "./categories/everything.js";
import PlaceMap from "./components/placeMap.js";
import AddPlace from "./addPlace.js";
import ExploreNearby from "./components/exploreNearby.js";
import { FilterProvider, FilterBar } from "./components/filters.js";

const Main = (props) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showMap, setShowMap] = useState(false);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
    );
  }, []);

  const activeTab = props.activeTab;
  return (
    <div className="main">
      {latitude !== null && longitude !== null ? (
        <table>
          <tr>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>City</th>
          </tr>
          <tr>
            <td>
              {latitude.toFixed(4)} <br />
              {latitude > 0 ? "N" : "S"}
            </td>
            <td>
              {longitude.toFixed(4)} <br />
              {longitude > 0 ? "E" : "W"}
            </td>
            <City latitude={latitude} longitude={longitude} />
          </tr>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      <AddPlace latitude={latitude} longitude={longitude} />
      <ExploreNearby latitude={latitude} longitude={longitude} />
      <FilterProvider>
        <FilterBar
          hasLocation={latitude !== null && longitude !== null}
          showMap={showMap}
          onToggleMap={() => setShowMap(!showMap)}
        />
        {showMap && (
          <PlaceMap
            latitude={latitude}
            longitude={longitude}
            activeTab={activeTab}
          />
        )}
        <nav hidden={showMap}>
          {activeTab === "everything" && (
            <Everything latitude={latitude} longitude={longitude} />
          )}
          {activeTab === "food" && (
            <Food latitude={latitude} longitude={longitude} />
          )}
          {activeTab === "destination" && (
            <Destination latitude={latitude} longitude={longitude} />
          )}
          {activeTab === "hotels" && (
            <Hotels latitude={latitude} longitude={longitude} />
          )}
          {activeTab === "gas" && (
            <Gas latitude={latitude} longitude={longitude} />
          )}
          {activeTab === "parks" && (
            <Parks latitude={latitude} longitude={longitude} />
          )}
          {activeTab === "stores" && (
            <Stores latitude={latitude} longitude={longitude} />
          )}
        </nav>
      </FilterProvider>
    </div>
  );
};

export default Main;
