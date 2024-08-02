import React from "react";
import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>To-do List</h1>
      <p>Make track of the things you need to do!</p>
    </div>
  );
};

export default Header;
