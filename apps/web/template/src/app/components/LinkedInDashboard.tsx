'use client';

import React, { useState, useEffect } from 'react';

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
        return (
          <div style={{ padding: 20 }}>
            <div
              id="followers-count"
              style={{ color: '#0073b1', fontSize: 12, cursor: 'pointer' }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Followers: {followers}
            </div>

            <div
              id="followers-list"
              style={{
                background: 'white',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '10px'
              }}
            >
              <ul id="followers-container" style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                  Example Follower
                </li>
              </ul>
            </div>

            <div
              className="modal"
              style={{
                display: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div
                className="modal-content"
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  width: '90%',
                  maxWidth: '400px'
                }}
              >
                Modal Content
              </div>
            </div>
          </div>
        );
    }
  };

  return renderPage();
};

export default LinkedInDashboard;