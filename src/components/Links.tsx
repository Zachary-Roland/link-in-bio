import { Button, Grid, Typography } from "@mui/material";
import "../App.css";
interface LinkObj {
	text: string;
	url: string;
}

type LinkProps = {
	isXs: boolean;
	isSm: boolean;
};

const Links = ({ isXs, isSm }: LinkProps) => {
	const links: LinkObj[] = [
		{
			text: "💼 Check out my resume",
			url: "https://drive.google.com/file/d/1Yza--EjkHYr69XBa9KDQnmNzc_aSU7u7/view?usp=sharing",
		},
		{
			text: "🎧 Listen to Bokr Tov",
			url: "https://bokrtov.bandcamp.com/",
		},
		{
			text: "🎧 Listen to Big Nope",
			url: "https://bignopebignope.bandcamp.com/",
		},
	];
	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems={"center"}
			justifyContent={"center"}
		>
			{links.map((link) => (
				<Grid key={`${link.text} button`} item xs={12} sx={{ margin: "15px" }}>
					<Button
						className="MuiButton"
						variant="contained"
						href={link.url}
						sx={
							isXs
								? { width: "250px", height: "50px" }
								: isSm
								? { width: "350px", height: "70px" }
								: { width: "450px", height: "90px" }
						}
					>
						<Typography variant={ isXs ? "body2": isSm ? "body1" : "h6" }>{link.text}</Typography>
					</Button>
				</Grid>
			))}
		</Grid>
	);
};

export default Links;
