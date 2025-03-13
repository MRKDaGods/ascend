"use client";
import React, { useState } from "react";
import { Home as HomeIcon, Users, Briefcase, MessageSquare, Bell, Menu } from "lucide-react";

interface UserData {
  name: string;
  profilePhoto: string;
  coverPhoto: string;
  role: string;
  entity: string;
  location: string;
}

const Navbar: React.FC<{ userData: UserData }> = ({ userData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Left: Logo & Search */}
          <div className="flex items-center space-x-4">
            <img src="/linkedin-logo.png" alt="LinkedIn" className="w-8 h-8" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 px-4 py-1 rounded-full w-64 hidden md:block focus:outline-none"
            />
          </div>

          {/* Center: Navigation Icons */}
          <div className="hidden md:flex space-x-6 text-gray-600">
            <HomeIcon className="w-6 h-6 hover:text-blue-500 cursor-pointer" />
            <Users className="w-6 h-6 hover:text-blue-500 cursor-pointer" />
            <Briefcase className="w-6 h-6 hover:text-blue-500 cursor-pointer" />
            <MessageSquare className="w-6 h-6 hover:text-blue-500 cursor-pointer" />
            <Bell className="w-6 h-6 hover:text-blue-500 cursor-pointer" />
          </div>

          {/* Right: Profile Dropdown */}
          <div className="relative">
            <img
              src={userData.profilePhoto || "https://via.placeholder.com/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={userData.profilePhoto || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="text-gray-800 font-semibold">{userData.name}</h2>
                    <p className="text-gray-500 text-sm">{userData.role} at {userData.entity}</p>
                  </div>
                </div>
                <hr className="my-2" />
                <a href="/profile" className="block text-blue-600 text-center font-semibold py-2 hover:underline">View Profile</a>
                <hr className="my-2" />
                <ul className="text-gray-700 text-sm">
                  <li className="py-2 hover:bg-gray-100 px-2 cursor-pointer">Settings & Privacy</li>
                  <li className="py-2 hover:bg-gray-100 px-2 cursor-pointer">Help</li>
                  <li className="py-2 hover:bg-gray-100 px-2 cursor-pointer">Language</li>
                </ul>
                <hr className="my-2" />
                <ul className="text-gray-700 text-sm">
                  <li className="py-2 hover:bg-gray-100 px-2 cursor-pointer">Posts & Activity</li>
                  <li className="py-2 hover:bg-gray-100 px-2 cursor-pointer">Job Posting Account</li>
                </ul>
                <hr className="my-2" />
                <button className="w-full text-left text-red-600 px-2 py-2 hover:bg-gray-100">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
