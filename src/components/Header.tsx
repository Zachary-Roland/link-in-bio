import { Avatar, Grid, IconButton, Typography, Box } from "@mui/material";
import { GitHub, Instagram, LinkedIn, Twitter } from "@mui/icons-material";

type HeaderProps = {
	isXs: boolean;
	isSm: boolean;
};

const Header = ({ isXs, isSm }: HeaderProps) => {
	const jobDetails: { role: string; company: string } = {
		role: "React Developer",
		company: "Talent Plus",
	};

	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Grid item xs={12}>
				<Avatar
					alt="Zachary Roland Profile Picture"
					src={require("../AvatarImg.jpeg")}
					sx={
						isXs
							? { width: 100, height: 100 }
							: isSm
							? { width: 120, height: 120 }
							: { width: 160, height: 160 }
					}
				/>
			</Grid>
			<Grid item xs={12}>
				<Typography variant={isXs ? "h5" : isSm ? "h4" : "h3" }>Zachary Roland</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography>{`${jobDetails.role} @ ${jobDetails.company}`}</Typography>
			</Grid>
			<Grid item xs={3}>
				<IconButton>
					<Instagram />
				</IconButton>
				<IconButton>
					<Twitter />
				</IconButton>
				<IconButton>
					<LinkedIn />
				</IconButton>
				<IconButton>
					<GitHub />
				</IconButton>
			</Grid>
			{/* <Grid item xs={6} sx={{ paddingLeft: "120px", paddingRight: "120px"}}>
				<Typography variant="body2">
				I'm a fashion designer turned web developer, and I’ve been working in my first role as a React Developer at Talent Plus since September of 2021. I completed Midland Code Academy’s Full Stack Development bootcamp in August of 2021 after three months of study, an achievement I attribute to my strong commitment to being efficient, disciplined, and organized. While studying at the Midland Code Academy, I learned how to think through logic flows to tackle complex ideas and break them down into actionable steps. I also learned how to apply those logic flows to write effective and well documented code. 
				</Typography>
			</Grid> */}
		</Grid>
	);
};

export default Header;
