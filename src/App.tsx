import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LinkedInProfile from "./LinkedInProfile"; // Ensure this file is LinkedInProfile.tsx
import UserProfile from "./UserProfile"; // Ensure this file is UserProfile.tsx

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route for LinkedInProfile */}
        <Route path="/" element={<LinkedInProfile />} />
        
        {/* Route for UserProfile */}
        <Route path="/user/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;

