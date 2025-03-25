'use client';
import React from 'react';
import LinkedInProfile from './components/LinkedInProfile';
import styles from "./page.module.css";

function Home() {
  return (
    <div className={styles.page}>
      <br></br>
      <LinkedInProfile />
    </div>
  );
}

export default Home;