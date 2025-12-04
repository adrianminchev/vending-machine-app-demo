import { createTheme } from "@mui/material";

export const vendingTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#111418",
      paper: "#313124",
    },
    primary: {
      main: "#2dd4bf",
    },
    secondary: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#22c55e",
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#94a3b8",
    },
  },
});
