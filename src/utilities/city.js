import React, { useEffect, useState } from "react";

const City = ({ latitude, longitude }) => {
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchLocationInfo(latitude, longitude);
    }
  }, [latitude, longitude]);

  const fetchLocationInfo = (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.address) {
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet;
          const state =
            data.address.state || data.address.province || data.address.region;
          if (city) {
            setCityName(city);
          }
          if (state) {
            setStateName(state);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false);
      });
  };

  return (
    <td>
      {loading ? (
        "Loading..."
      ) : (
        <>
          {cityName && <div>{cityName}, </div>}
          {stateName && <div>{stateName}</div>}
          {!cityName && !stateName && "Location Not Found"}
        </>
      )}
    </td>
  );
};
/*
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchCityName(latitude, longitude);
    }
  }, [latitude, longitude]);

  const fetchCityName = (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.address) {
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet;
          if (city) {
            setCityName(city);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false);
      });
  };

  return (
    <td>{loading ? "Loading..." : cityName ? cityName : "City Not Found"}</td>
  );
};
*/
export default City;
