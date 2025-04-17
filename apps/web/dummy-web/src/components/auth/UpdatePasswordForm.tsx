import React, { useState } from 'react';
import { handleUpdatePassword } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function UpdatePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateResult = await handleUpdatePassword(oldPassword, newPassword);
      setResult(updateResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Update Password</h2>
      <p className={styles.formNote}>You must be logged in to update your password</p>
      
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Current Password</label>
          <input
            className={styles.input}
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Current Password"
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
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      
      {result && (
        <div className={`${styles.resultContainer} ${result.success ? styles.success : styles.error}`}>
          <h3>{result.success ? "Password Updated Successfully" : "Failed to Update Password"}</h3>
          {!result.success && <p>Error: {result.error?.toString()}</p>}
          {result.success && <p>Your password has been updated successfully</p>}
        </div>
      )}
    </div>
  );
}
