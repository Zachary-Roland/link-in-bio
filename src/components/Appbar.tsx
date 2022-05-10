import { Grid, IconButton } from "@mui/material";
import { Settings, DarkMode, LightMode } from "@mui/icons-material";
import { useState } from "react";

const Appbar = () => {
	const [isDark, setIsDark] = useState(true);

	return (
		<Grid container>
			<Grid item xs={3}>
				<IconButton size={"large"}>{isDark ? <LightMode /> : <DarkMode />}</IconButton>
			</Grid>
            <Grid item xs={6} />
			<Grid container xs={3} justifyContent={"end"}>
				<IconButton size={"large"}>
					<Settings />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default Appbar;
