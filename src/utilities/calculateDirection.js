const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const calculateDirection = (lat1, lon1, lat2, lon2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
  const x =
    Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);

  return (Math.atan2(y, x) * 180) / Math.PI;
};

export default calculateDirection;
