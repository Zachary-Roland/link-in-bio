import React from 'react';
import "@fontsource/roboto";
import './App.css';
import { Container, Typography } from "@mui/material";
import Header from "./components/Header";
import Links from "./components/Links";

function App() {
  return (
    <>
      <Header />
      <Typography>Some Text</Typography>
    <Container>
      <div>Some Text</div>
      <Links />
    </Container>
    </>
  );
}

export default App;
