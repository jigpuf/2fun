import React, { useState, useEffect } from "react";

const Distance = (props) => {
  const [distance, setDistance] = useState(null);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        // Calculate distance and direction between user's location and target coordinates
        const latitude = props.latitude;
        const longitude = props.longitude;

        const { distance, direction } = calculateDistanceAndDirection(
          userLatitude,
          userLongitude,
          latitude,
          longitude
        );

        setDistance(distance);
        setDirection(direction);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const calculateDistanceAndDirection = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Calculate distance using Haversine formula (same as before)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    // Calculate direction using bearing formula
    const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
    const x =
      Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
      Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);

    const direction = (Math.atan2(y, x) * 180) / Math.PI;

    return { distance, direction };
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const convertKmToMiles = (distanceInKm) => {
    const milesConversionFactor = 0.62137119;
    const distanceInMiles = distanceInKm * milesConversionFactor;

    return distanceInMiles.toFixed(2);
  };

  const getCardinalDirection = (angle) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index =
      Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
  };

  return (
    <div>
      {distance ? (
        <p>
          Distance: {convertKmToMiles(distance)}
          <span className="cardinal">
            |{getCardinalDirection(direction)}| {direction.toFixed(0)}° |{" "}
            <div>
              <img
                style={{
                  display: "block;",
                  width: "30%",
                  height: "auto",
                  transform: `rotate(${direction}deg)`,
                  position: "relative",
                }}
                src="/arrow.png"
              ></img>
            </div>
          </span>
        </p>
      ) : (
        <p>Calculating distance and direction...</p>
      )}
    </div>
  );
};

export default Distance;
