import { Grid, Card, CardContent, TextField, Button } from "@mui/material";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type LoginProps = {
	isXs: boolean;
	isSm: boolean;
	isAdmin: boolean;
	setIsAdmin: Function;
};

const Login = ({ isXs, isSm, isAdmin, setIsAdmin }: LoginProps) => {
	const navigate = useNavigate();
	const handleLogin = () => {
		//TODO if email and username match log in, then do this
		setIsAdmin(true);
		navigate("/");
	};
	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems={"center"}
			justifyContent={"center"}
			sx={{ height: "80vh" }}
		>
			<Card
				sx={{
					backgroundColor: "secondary.main",
					width: isXs ? "290px" : isSm ? "375px" : "400px",
                    "&:hover": {
                        borderColor: "background.default",
                        boxShadow: "none",
                    }
				}}
			>
				<CardContent>
					<Grid
						container
						spacing={0}
						direction="column"
						alignItems={"center"}
						justifyContent={"center"}
					>
						<Typography
							variant={isXs ? "h5" : isSm ? "h4" : "h3"}
							sx={{ marginTop: "24px", marginBottom: "24px" }}
						>
							Admin
						</Typography>
						<TextField label="Username" color="info" sx={{ margin: "12px" }} />
						<TextField label="Password" color="info" sx={{ margin: "12px" }} />
						<Grid item sx={{ marginTop: "24px" }}>
							<Button
								onClick={() => navigate("/")}
								sx={{
									margin: "12px",
									borderColor: "secondary.main",
									color: "#fff",
									"&:hover": {
										backgroundColor: "primary.main",
										borderColor: "primary.main",
									},
								}}
							>
								Back
							</Button>
							<Button
								className="MuiButton"
								variant="contained"
								onClick={() => handleLogin()}
								sx={{ margin: "12px", border: `1px solid #6942ef` }}
							>
								Login
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</Grid>
	);
};

export default Login;
