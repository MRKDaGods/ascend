"use client";
import React from "react";
import { Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

const AuthButtons = () => {
  const router = useRouter();

  return (
    <Stack spacing={2} mt={3} width="100%" sx={{ maxWidth:400}}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<img src="/google.webp" alt="Google" width={24} height={24} />} 
        sx={{borderRadius: "5em",
           borderColor: "black",
           color: "black",
           textTransform: "none" }}
      >
        Continue as Mehrati
      </Button>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<img src="/microsoft.png" alt="Microsoft" width={24} height={24} />} 
        sx={{borderRadius: "5em",
          borderColor: "black",
          color: "black",
          textTransform: "none" }}
      >
        Continue with Microsoft
      </Button>
      <Button fullWidth variant="outlined" onClick={() => router.push("/signInWithEmail")}
       sx={{borderRadius: "5em",
        borderColor: "black",
        color: "black",
        textTransform: "none" }}>
        Sign in with email
      </Button>
    </Stack>
  );
};

export default AuthButtons;