import React, { useState } from 'react';
import { handleLogout } from '../../services/auth/handlers';
import styles from '../../styles/layout.module.css';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onLogout = async () => {
    setLoading(true);
    try {
      const logoutResult = await handleLogout();
      setResult(logoutResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.logoutContainer}>
      <button 
        onClick={onLogout} 
        disabled={loading}
        className={styles.logoutButton}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
      
      {result && (
        <span className={`${styles.statusMessage} ${result.success ? styles.success : styles.error}`}>
          {result.success ? 
            "Successfully logged out" : 
            `Error: ${result.error?.toString()}`
          }
        </span>
      )}
    </div>
  );
}
