import { Grid, IconButton } from "@mui/material";
import { Settings, DarkMode, LightMode } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type AppbarProps = {
	isXs: boolean;
	isSm: boolean;
};

const Appbar = ({ isXs, isSm }: AppbarProps) => {
	const navigate = useNavigate();
	const [isDark, setIsDark] = useState(true);
	const fontSize = isSm ? "medium" : "large";
	const darkHover = { color: "primary.main", backgroundColor: "background.default"};
	const lightHover = { color: "#e5a546", backgroundColor: "background.default" }
	const iconSx = { color: "#383a48", "&:hover": darkHover} 
	return (
		<Grid container sx={ isSm ? null : { marginTop: "12px" } }>
			<Grid item xs={3}>
				<IconButton sx={{ ...iconSx, "&:hover": ( !isDark ? darkHover : lightHover ) }} onClick={()=> setIsDark(!isDark)}>{isDark ? <LightMode fontSize={fontSize} /> : <DarkMode fontSize={fontSize}/>}</IconButton>
			</Grid>
            <Grid item xs={6} />
			<Grid container xs={3} justifyContent={"end"}>
				<IconButton onClick={()=> navigate("/login")} sx={iconSx} >
					<Settings fontSize={fontSize }/>
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default Appbar;
