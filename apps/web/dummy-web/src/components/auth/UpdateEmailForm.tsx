import React, { useState } from 'react';
import { handleUpdateEmail } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function UpdateEmailForm() {
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateResult = await handleUpdateEmail(newEmail);
      setResult(updateResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Update Email</h2>
      <p className={styles.formNote}>You must be logged in to update your email</p>
      
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>New Email Address</label>
          <input
            className={styles.input}
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New Email Address"
            required
          />
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Email"}
        </button>
      </form>
      
      {result && (
        <div className={`${styles.resultContainer} ${result.success ? styles.success : styles.error}`}>
          <h3>{result.success ? "Email Update Initiated" : "Failed to Update Email"}</h3>
          {!result.success && <p>Error: {result.error?.toString()}</p>}
          {result.success && (
            <p>An email has been sent to your new address. Please follow the instructions to confirm.</p>
          )}
        </div>
      )}
    </div>
  );
}
