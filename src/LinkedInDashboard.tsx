import React, { useState, useEffect } from 'react';
import './LinkedInDashboard.css';

const LinkedInDashboard: React.FC = () => {
  const [page, setPage] = useState<string>('dashboard');
  const [followers, setFollowers] = useState<number>(0);

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      const response = await fetch("http://localhost:3000/followers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: { count: number } = await response.json();
      setFollowers(data.count);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const renderPage = () => {
    switch (page) {
      default:
        return <div className="linkedin-dashboard"></div>; // Empty dashboard
    }
  };

  return renderPage();
};

export default LinkedInDashboard;
