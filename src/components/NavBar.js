import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "../App.css";

const NavBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Post It!
          </Typography>
          <Link style={{ textDecoration: "none", color: "#fff" }} to="/">
            <Button color="inherit">Camera</Button>
          </Link>
          <Link
            style={{ textDecoration: "none", color: "#fff" }}
            to="/videoRecorder"
          >
            <Button color="inherit">Video Recorder</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
