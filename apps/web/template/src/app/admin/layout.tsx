import AdminNavbar from "../components/AdminNavbar";
import { Box } from "@mui/material";

export default function AdminLayout({children}: { children: React.ReactNode }) {
  return (
    <Box sx={{ padding:4 }}>
      <AdminNavbar />
      {children}
    </Box>
  );

}