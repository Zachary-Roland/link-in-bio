import React, { useState } from "react";
import "@fontsource/roboto";
import { Container, Grid, ThemeProvider, Typography } from "@mui/material";
import Header from "./components/Header";
import Links from "./components/Links";
import useMediaQuery from "@mui/material/useMediaQuery";
import darkTheme from "./common/styles";
import Appbar from "./components/Appbar";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
	const isXs: boolean = useMediaQuery("(max-width:420px)");
	const isSm: boolean = useMediaQuery("(max-width:600px)");
	return (
		<ThemeProvider theme={darkTheme}>
			<Container
				maxWidth={false}
				sx={{
					paddingTop: "12px",
					paddingBottom: "48px",
					minWidth: "320px",
					height: "100vh",
				}}
			>
				<Appbar isXs={isXs} isSm={isSm} />
				<Routes>
					<Route
						path="/"
						element={
							<>
								<Header isXs={isXs} isSm={isSm} />
								<Links isXs={isXs} isSm={isSm} isAdmin={isAdmin} />
							</>
						}
					/>
          <Route path="/login" element={<Login isXs={isXs} isSm={isSm} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}/>
				</Routes>

				{/* <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0}}>
        <Grid container alignItems={"center"} justifyContent={"center"}>
        <Grid item xs={12} 
			spacing={0}
			direction="column" alignItems={"center"} justifyContent={"center"}>
        <Typography variant="caption">Hey, I made this! Isn't that cool?</Typography>
        </Grid>
        <Grid item xs={12}>
        <Typography variant="caption"> If you want, you can check out the project on GitHub!</Typography>
        </Grid>
        </Grid>
      </Box> */}
			</Container>
		</ThemeProvider>
	);
}

export default App;
