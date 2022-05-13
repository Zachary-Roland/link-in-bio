import { Grid, IconButton } from "@mui/material";
import { Settings, DarkMode, LightMode } from "@mui/icons-material";
import { useState } from "react";

type AppbarProps = {
	isXs: boolean;
	isSm: boolean;
};

const Appbar = ({ isXs, isSm }: AppbarProps) => {
	const [isDark, setIsDark] = useState(true);
	const fontSize = isSm ? "medium" : "large";
	const iconSx = { color: "primary.main", "&:hover": { color: "#fff", backgroundColor: "background.default" }}
	return (
		<Grid container sx={ isSm ? null : { marginTop: "12px" } }>
			<Grid item xs={3}>
				<IconButton sx={iconSx} onClick={()=> setIsDark(!isDark)}>{isDark ? <LightMode fontSize={fontSize} /> : <DarkMode fontSize={fontSize}/>}</IconButton>
			</Grid>
            <Grid item xs={6} />
			<Grid container xs={3} justifyContent={"end"}>
				<IconButton sx={iconSx} >
					<Settings fontSize={fontSize }/>
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default Appbar;
