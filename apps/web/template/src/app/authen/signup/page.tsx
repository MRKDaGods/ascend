import Header from "@/app/components/Header";
import LoginBox from "@/app/components/LoginBox";
import Footer from "@/app/components/Footer";
import Logo from "@/app/components/Logo";
import { Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="space-between" alignItems="center" bgcolor="white">
      <Logo />
      <LoginBox />
    </Box>
  );
}