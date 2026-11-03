import React, { useState } from "react";

const STORAGE_KEY = "2fun-saved-places";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toList = (text) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const loadSaved = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      food: saved?.food || [],
      hotels: saved?.hotels || [],
      gas: saved?.gas || [],
    };
  } catch {
    return { food: [], hotels: [], gas: [] };
  }
};

const emptyForm = {
  name: "",
  url: "",
  street: "",
  city: "",
  state: "",
  country: "United States",
  type: "",
  favorites: "",
  nasty: "",
  rating: "",
  note: "",
};

// Builds an entry in the same shape as foodList.js, hotelList.js, or gasList.js
const buildEntry = (category, form, latitude, longitude) => {
  const location = {
    latitude: Number(latitude.toFixed(4)),
    longitude: Number(longitude.toFixed(4)),
  };
  const address = {
    country: form.country,
    state: form.state,
    city: form.city,
    street: form.street,
  };
  if (category === "food") {
    return {
      restaurant: form.name,
      url: form.url,
      address,
      location,
      type: toList(form.type),
      favorites: toList(form.favorites),
      nasty: toList(form.nasty),
      slug: slugify(`${form.name}-${form.city}`),
      like: [],
    };
  }
  if (category === "hotels") {
    return {
      hotel: form.name,
      url: form.url,
      address,
      location,
      rating: form.rating,
      note: form.note,
    };
  }
  return {
    name: form.name,
    city: [form.city, form.state].filter(Boolean).join(", "),
    location,
    slug: slugify(`${form.name}-${form.city}`),
    note: form.note,
  };
};

const entryName = (item) => item.restaurant || item.hotel || item.name;

const AddPlace = ({ latitude, longitude }) => {
  const [category, setCategory] = useState("food");
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(loadSaved);
  const [status, setStatus] = useState("");

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const persist = (next) => {
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  // Fill street, city, and state from the current GPS position
  const fillAddress = () => {
    if (latitude === null || longitude === null) return;
    setStatus("Looking up address...");
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
    )
      .then((res) => res.json())
      .then((data) => {
        const a = data.address || {};
        setForm((f) => ({
          ...f,
          name: f.name || data.name || "",
          street: [a.house_number, a.road].filter(Boolean).join(" "),
          city: a.city || a.town || a.village || a.hamlet || "",
          state: a.state || "",
          country: a.country || f.country,
        }));
        setStatus("");
      })
      .catch(() => setStatus("Couldn't look up the address."));
  };

  const save = (e) => {
    e.preventDefault();
    if (latitude === null || longitude === null) {
      setStatus("Waiting for your location...");
      return;
    }
    if (!form.name.trim()) {
      setStatus("Add a name first.");
      return;
    }
    const entry = buildEntry(category, form, latitude, longitude);
    persist({ ...saved, [category]: [...saved[category], entry] });
    setForm(emptyForm);
    setStatus(`Saved ${entryName(entry)}.`);
  };

  const remove = (cat, index) => {
    persist({ ...saved, [cat]: saved[cat].filter((_, i) => i !== index) });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(saved, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `2fun-places-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const total = saved.food.length + saved.hotels.length + saved.gas.length;

  return (
    <details className="add-place">
      <summary>Add this place ({total} saved)</summary>
      <form onSubmit={save}>
        <label>
          Category:{" "}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="food">Food</option>
            <option value="hotels">Hotel</option>
            <option value="gas">Gas station</option>
          </select>
        </label>
        <br />
        <button type="button" onClick={fillAddress}>
          Use my location for the address
        </button>
        <br />
        Name: <input type="text" value={form.name} onChange={update("name")} />
        <br />
        {category !== "gas" && (
          <>
            Website:{" "}
            <input type="url" value={form.url} onChange={update("url")} />
            <br />
            Street:{" "}
            <input
              type="text"
              value={form.street}
              onChange={update("street")}
            />
            <br />
          </>
        )}
        City: <input type="text" value={form.city} onChange={update("city")} />
        <br />
        State:{" "}
        <input type="text" value={form.state} onChange={update("state")} />
        <br />
        {category === "food" && (
          <>
            Type (comma separated):{" "}
            <input type="text" value={form.type} onChange={update("type")} />
            <br />
            Good (comma separated):{" "}
            <input
              type="text"
              value={form.favorites}
              onChange={update("favorites")}
            />
            <br />
            Nasty (comma separated):{" "}
            <input type="text" value={form.nasty} onChange={update("nasty")} />
            <br />
          </>
        )}
        {category === "hotels" && (
          <>
            Rating:{" "}
            <input
              type="text"
              value={form.rating}
              onChange={update("rating")}
            />
            <br />
          </>
        )}
        {category !== "food" && (
          <>
            Notes:
            <br />
            <textarea
              style={{ width: "90%" }}
              value={form.note}
              onChange={update("note")}
            />
            <br />
          </>
        )}
        <small>
          {latitude !== null && longitude !== null
            ? `Saving at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : "Waiting for your location..."}
        </small>
        <br />
        <button type="submit">Save</button> {status}
      </form>

      {total > 0 && (
        <>
          <ul>
            {["food", "hotels", "gas"].map((cat) =>
              saved[cat].map((item, i) => (
                <li key={`${cat}-${i}`}>
                  {entryName(item)} ({cat}){" "}
                  <button type="button" onClick={() => remove(cat, i)}>
                    Delete
                  </button>
                </li>
              )),
            )}
          </ul>
          <button type="button" onClick={exportJson}>
            Export JSON
          </button>
        </>
      )}
    </details>
  );
};

export default AddPlace;
