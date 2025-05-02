import AdminNavbar from "../components/AdminNavbar";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({children}: { children: React.ReactNode }) {
  return (
    <Box sx={{ padding:4 }}>
      <AdminNavbar />
      {children}
      <ToastContainer aria-label="Dismiss toast" />
    </Box>
  );

}