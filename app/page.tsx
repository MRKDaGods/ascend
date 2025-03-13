"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import NotificationCard from "../components/NotificationCard";
import Footer from "@/components/Footer";
import '../app/globals.css';

export default function Home() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    profilePhoto: "",
    coverPhoto: "",
    role: "",
    entity: "",
    location: "",
  });

  // Fetch user data when the page loads
  useEffect(() => {
    fetch("http://localhost:5000/api/user")
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  return (
    <main className="overflow-hidden bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar userData={userData} />

      {/* Responsive Layout */}
      <div className="flex flex-col md:flex-row w-full gap-4 px-4 pt-16 items-center md:items-start">
        {/* ProfileCard on top for mobile, left for larger screens */}
        <div className="w-full flex justify-center md:w-1/3 md:justify-start order-1 md:order-none">
          <ProfileCard userData={userData} />
        </div>

        {/* NotificationCard below ProfileCard on mobile, right on larger screens */}
        <div className="w-full flex justify-center md:flex-1 md:justify-start order-2 md:order-none">
          <div className="w-full max-w-4xl"> 
            <NotificationCard />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
