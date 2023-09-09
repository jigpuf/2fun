import React, { useState } from "react";

const Nav = (props) => {
  const buttons = [
    { name: "food", slug: "food", src: "/chopsticks.png" },
    { name: "destination", slug: "destination", src: "/compass.png" },
    { name: "music", slug: "music", src: "/music.png" },
    { name: "people", slug: "people", src: "/people.png" },
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
