import React from "react";
import styles from "../styles/Header.module.css";
import { Typography } from "@mui/material";

const Header = () => {
  return (
    <div className={styles.header}>
      <Typography sx={{ m: 1 }} variant="h3">
        To-do List
      </Typography>
      <Typography sx={{ fontSize: 14 }} color="text.secondary">
        Track what you need to do!
      </Typography>
    </div>
  );
};

export default Header;
