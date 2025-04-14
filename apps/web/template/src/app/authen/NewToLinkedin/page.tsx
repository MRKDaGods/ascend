import React from "react";
import SignUp from "@/app/components/SignUp";
import { Container } from "@mui/material";
import Logo from "@/app/components/Logo";

const Page = () => {
  return (
    <>
      <Logo />
      <Container>
        <SignUp />
      </Container>
    </>
  );
};

export default Page;
