import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0077b5", // LinkedIn blue
    },
    secondary: {
      main: "#000000",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
