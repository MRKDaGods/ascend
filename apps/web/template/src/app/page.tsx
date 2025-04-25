"use client";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PremiumSurvey from "../components/PremiumSurvey";
import PremiumPage from "../components/PremiumPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Survey Route */}
        <Route path="/" element={<PremiumSurvey />} />

        {/* Premium Membership Page Route */}
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
    </Router>
  );
};

export default App;