import React, { useState } from 'react';
import { getAuthToken } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function AuthTokenDisplay() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = () => {
    const result = getAuthToken();
    if (result.success) {
      setToken(result.token!);
      setError(null);
    } else {
      setToken(null);
      setError(result.error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Current Auth Token</h3>
      <button className={styles.button} onClick={fetchToken}>Fetch Current Token</button>
      {token ? (
        <pre className={styles.preContainer}>{token}</pre>
      ) : (
        <p>{error || "No token set or not logged in"}</p>
      )}
    </div>
  );
}
