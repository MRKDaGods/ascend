"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Button, Stack } from "@mui/material";
//create array of objects with label and href for the admin navbar
const navLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Posts", href: "/admin/posts" },
  { label: "Jobs", href: "/admin/jobs" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2}>
        {navLinks.map((link) => (
            //create link element for each path in the array
          <Link
            key={link.label}
            href={link.href}
            style={{ textDecoration: "none" }}
          >
            
            <Button
              variant={pathname === link.href ? "contained" : "outlined"}
              color="primary"
            >
              {link.label}
            </Button>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}
