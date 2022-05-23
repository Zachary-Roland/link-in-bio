import {
	Button,
	Card,
	CardActionArea,
	Fab,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import "../common/App.css";
import { useNavigate } from "react-router-dom";
interface LinkObj {
	text: string;
	url: string;
}

type LinkProps = {
	isXs: boolean;
	isSm: boolean;
	isAdmin: boolean;
	fontSize: "small" | "inherit" | "large" | "medium" | undefined;
};

const Links = ({ isXs, isSm, isAdmin, fontSize }: LinkProps) => {
	const navigate = useNavigate();
	const handleClick = (path: string) => {
		if (!isAdmin) {
			// navigate(path);
			window.open(path);
		}
	};
	const links: LinkObj[] = [
		{
			text: "💼 Look at my resume",
			url: "https://drive.google.com/file/d/1Yza--EjkHYr69XBa9KDQnmNzc_aSU7u7/view?usp=sharing",
		},
		{
			text: "🎸 Listen to Bokr Tov",
			url: "https://bokrtov.bandcamp.com/",
		},
		{
			text: "🎸 Listen to Big Nope",
			url: "https://bignopebignope.bandcamp.com/",
		},
	];
	return (
		<Grid
			container
			spacing={0}
			direction={"column"}
			alignItems={"center"}
			justifyContent={"center"}
			sx={{ marginTop: "24px" }}
		>
			{links.map((link) => (
				<Grid key={`${link.text} button`} item xs={12} sx={{ margin: "15px" }}>
					<Card
						// className="MuiButton"
						// variant="contained"
						onClick={() => handleClick(link.url)}
						sx={
							isXs
								? { width: "260px", height: "50px" }
								: isSm
								? { width: "350px", height: "70px" }
								: { width: "450px", height: "90px" }
						}
					>
						<CardActionArea className="MuiButton" sx={{ height: "100%" }}>
							<Grid
								container
								spacing={0}
								direction={"row"}
								alignItems={"center"}
								justifyContent={"center"}
							>
								<Grid container xs={isAdmin ? 8 : 12} justifyContent={"center"}>
									<Typography variant={isXs ? "body2" : isSm ? "body1" : "h6"}>
										{link.text}
									</Typography>
								</Grid>
								{isAdmin ? (
									<Grid container xs={4} justifyContent={"end"}>
										<IconButton
											sx={{
												"&:hover": {
													backgroundColor: "secondary.main",
												},
											}}
										>
											<EditIcon fontSize={isSm ? "small" : "medium"} />
										</IconButton>
										<IconButton
											sx={{
												marginRight: isXs ? "5px" : isSm ? "10px" : "15px",
												"&:hover": {
													backgroundColor: "secondary.main",
												},
											}}
										>
											<DeleteIcon fontSize={isSm ? "small" : "medium"} />
										</IconButton>
									</Grid>
								) : null}
							</Grid>
						</CardActionArea>
					</Card>
				</Grid>
			))}
			{isAdmin && (
				<Grid item xs={12} sx={{ margin: "24px" }}>
					<Fab color="secondary" sx={{ color: "#fff" }}>
						<AddIcon />
					</Fab>
				</Grid>
			)}
		</Grid>
	);
};

export default Links;
