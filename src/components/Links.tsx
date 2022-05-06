import { Button, Grid } from "@mui/material";
interface LinkObj {
	text: string;
	url: string;
}

type LinkProps = {
	isXs: boolean;
	isSm: boolean;
}

const Links = ({ isXs, isSm }: LinkProps) => {
	const links: LinkObj[] = [
		{
			text: "Check out my resume",
			url: "https://drive.google.com/file/d/1Yza--EjkHYr69XBa9KDQnmNzc_aSU7u7/view?usp=sharing",
		},
		{
			text: "Listen to Bokr Tov",
			url: "https://bokrtov.bandcamp.com/",
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
				<Grid key={`${link.text} button`} item xs={12} sx={{ margin: "15px"}}>
					<Button variant="contained" href={link.url} sx={{ width: "250px", height: "50px" }}>{link.text}</Button>
				</Grid>
			))}
		</Grid>
	);
};

export default Links;
