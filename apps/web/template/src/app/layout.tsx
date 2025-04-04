"use client";

import { ApiInitializer } from "../api";
import "../app/globals.css"; // Ensure the correct import path

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground ">
        <ApiInitializer content={() => children} />
      </body>
    </html>
  );
}