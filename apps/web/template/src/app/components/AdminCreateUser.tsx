"use client";
import { useState } from "react";
import { Box, Stack, Typography, TextField, Button } from "@mui/material";
import { Password } from "@mui/icons-material";
import { createAdminUser } from "../utils/adminApi";
import { toast } from "react-toastify";

export default function AdminCreateUser() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async () => {
    const { firstName, lastName, email, password } = form;
    try {
        const response = await createAdminUser({
            firstName,
            lastName,
            email,
            password,
        });
        console.log(response.data);
        // Clear the form fields after successful submission
        setForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        });
        toast.success("Admin user created successfully!");
    } catch (error) {
        console.error("Error creating user:", error);
        toast.error("Failed to create admin user. Please try again.");
      
    }
};
  return (
    <Box sx={{ p: 2, maxWidth: 400, margin: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Create Admin User
      </Typography>

    <Stack spacing={2}>
      <TextField
        label="First Name"
        aria-label="First Name input"
        value={form.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        required
        error={!form.firstName}
        helperText={!form.firstName ? "First Name is required" : ""} //small hint
      />
      <TextField
        label="Last Name"
        aria-label="First Name input"
        value={form.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
        required
        error={!form.lastName}
        helperText={!form.lastName ? "Last Name is required" : ""}
      />
      <TextField
        label="Email"
        aria-label="Email input"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
        type="email"
        error={!form.email}
        helperText={!form.email ? "Email is required" : ""}
      />
      <TextField
        label="Password"
        aria-label="Password input"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required
        type="password"
        error={!form.password}
        helperText={!form.password ? "Password is required" : ""}
      />

      <Button
        variant="contained"
        color="primary"
        aria-label="Create admin user button"
        onClick={() => {
        if (
          form.firstName &&
          form.lastName &&
          form.email &&
          form.password
        ) {
          handleSubmit();
        } else {
          toast.error("All fields are required!");
        }
        }}
      >
        Create Admin
      </Button>
    </Stack>
    </Box>
  );
}
