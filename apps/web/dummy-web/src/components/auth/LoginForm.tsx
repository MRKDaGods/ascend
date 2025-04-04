import React, { useState } from 'react';
import { handleLogin } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authResult, setAuthResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await handleLogin(email, password);
      setAuthResult(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Login</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      {authResult && (
        <div className={`${styles.resultContainer} ${authResult.success ? styles.success : styles.error}`}>
          <h3>{authResult.success ? "Login Successful" : "Login Failed"}</h3>
          {authResult.success ? (
            <div>
              <p><strong>User ID:</strong> {authResult.user_id}</p>
              <p><strong>Auth Token:</strong></p>
              <pre className={styles.preContainer}>{authResult.token}</pre>
              <p>Token has been set in the client</p>
            </div>
          ) : (
            <p>Error: {authResult.error?.toString()}</p>
          )}
        </div>
      )}
    </div>
  );
}
