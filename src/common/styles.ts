import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
	interface ThemeOptions {
		themeName?: string;
	}
}

const darkTheme = createTheme({
	palette: {
		contrastThreshold: 4.5,
		mode: "dark",
		primary: {
			main: "#6846E5",
			light: "#9f74ff",
			dark: "#2719b2"
		},
		secondary: {
			main: "#f50057",
			light: "#ff5983",
			dark: "#bb002f"
		},
		info: {
			main: "#2719b2",
		},
		background: {
			default: "#121421",
			paper: "#1B1F30",
		},
	},
	shape: {
		borderRadius: 25,
	},
	components: {
		MuiIconButton: {
			styleOverrides: {
				root: {
					"&:hover": {
						backgroundColor: "#6846E5", //F78054
					},
				},
			},
		},
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #121421',
                    "&:hover": {
                        border: '1px solid #6942ef',
                        boxShadow: '0px 0px 30px 5px rgba(0,101,255,0.74)',
                    },
                }
            }
        },
		MuiContainer: {
			styleOverrides: {
				root: {
					background: "#121421",
				},
			},
		},
		MuiTypography: {
			styleOverrides: {
				root: {
					color: "#FFFFFF",
				},
			},
		},
	},
});

export default darkTheme;
