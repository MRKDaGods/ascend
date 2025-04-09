import React, { useState } from 'react';
import { handleForgetPassword } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const forgetResult = await handleForgetPassword(email);
      setResult(forgetResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Request Password Reset</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email Address</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Requesting..." : "Request Password Reset"}
        </button>
      </form>
      
      {result && (
        <div className={`${styles.resultContainer} ${result.success ? styles.success : styles.error}`}>
          <h3>{result.success ? "Password Reset Requested" : "Failed to Request Reset"}</h3>
          {!result.success && <p>Error: {result.error?.toString()}</p>}
          {result.success && (
            <p>If an account with this email exists, you will receive instructions to reset your password.</p>
          )}
        </div>
      )}
    </div>
  );
}
