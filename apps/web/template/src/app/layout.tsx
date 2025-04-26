import "../app/globals.css"; // Ensure the correct import path
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground ">{children}</body>
      
    </html>
  );
}