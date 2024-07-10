import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme, Theme } from "@mui/material/styles";
import { useThemeContext } from "../contexts/ThemeContext";

const Header: React.FC = () => {
  const theme: Theme = useTheme();
  const { toggleTheme } = useThemeContext();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <IconButton color="inherit" onClick={toggleTheme}>
          {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
