import React from "react";

const Nav = (props) => {
  const buttons = [
    { name: "everything", slug: "everything", src: "/everything.png" },
    { name: "food", slug: "food", src: "/chopsticks.png" },
    { name: "destination", slug: "destination", src: "/compass.png" },
    { name: "hotels", slug: "hotels", src: "/hotel.png" },
    { name: "gas", slug: "gas", src: "/gas.png" },
    { name: "parks", slug: "parks", src: "/park.png" },
    { name: "stores", slug: "stores", src: "/store.png" },
  ];
  const renderButtons = buttons.map((item) => {
    return (
      <button
        key={item.slug}
        className={props.activeTab === item.slug ? "active" : ""} //ternary
        onClick={props.openTab(item.slug)}
      >
        <img src={item.src} alt={item.name} />
      </button>
    );
  });
  return <div className="nav">{renderButtons}</div>;
};
export default Nav;
