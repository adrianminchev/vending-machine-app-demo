import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { vendingTheme } from "./theme/vendingTheme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={vendingTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
