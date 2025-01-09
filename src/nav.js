import React, { useState } from "react";

const Nav = (props) => {
  const buttons = [
    { name: "food", slug: "food", src: "/chopsticks.png" },
    { name: "destination", slug: "destination", src: "/compass.png" },
    { name: "hotels", slug: "hotels", src: "/hotel.png" },
    { name: "gas", slug: "gas", src: "/gas.png" },
    { name: "snacks", slug: "snacks", src: "/bag.png" },
  ];
  const renderButtons = buttons.map((item) => {
    return (
      <button
        className={props.activeTab === item.slug ? "active" : ""} //ternary
        onClick={props.openTab(item.slug)}
      >
        <img src={item.src}></img>
      </button>
    );
  });
  return <div class="nav">{renderButtons}</div>;
};
export default Nav;
