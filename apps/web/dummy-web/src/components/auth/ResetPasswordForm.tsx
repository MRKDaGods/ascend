import React, { useState } from 'react';
import { handleResetPassword } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function ResetPasswordForm() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resetResult = await handleResetPassword(token, newPassword);
      setResult(resetResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Reset Password</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Reset Token</label>
          <input
            className={styles.input}
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Reset Token (from email)"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>New Password</label>
          <input
            className={styles.input}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
          />
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      
      {result && (
        <div className={`${styles.resultContainer} ${result.success ? styles.success : styles.error}`}>
          <h3>{result.success ? "Password Reset Successfully" : "Failed to Reset Password"}</h3>
          {!result.success && <p>Error: {result.error?.toString()}</p>}
          {result.success && <p>Your password has been reset. You can now log in with your new password.</p>}
        </div>
      )}
    </div>
  );
}
