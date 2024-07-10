// src/App.tsx
import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";

const App: React.FC = () => {
  const theme = createTheme();

  const routes = useRoutes([
    { path: "/", element: <Navigate to="/login" /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/dashboard", element: <Dashboard /> },
  ]);

  return (
    <>
      <Header />
      {routes}
    </>
  );
};

export default App;
