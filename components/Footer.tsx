'use client';
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm mt-10 py-6 px-4 flex flex-col items-center">
      <div className="flex flex-wrap justify-center space-x-4 mb-2">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Accessibility</a>
        <a href="#" className="hover:underline">Help Center</a>
        <a href="#" className="hover:underline">Privacy & Terms</a>
        <a href="#" className="hover:underline">Ad Choices</a>
        <a href="#" className="hover:underline">Advertising</a>
        <a href="#" className="hover:underline">Business Services</a>
        <a href="#" className="hover:underline">Get the Ascend app</a>
        <a href="#" className="hover:underline">More</a>
      </div>
      <div className="mt-2 text-gray-500">
        <span className="font-semibold text-gray-700">Asc</span>
        <span className="text-blue-600 font-bold">end</span> Corporation &copy; 2025
      </div>
    </footer>
  );
};

export default Footer;
