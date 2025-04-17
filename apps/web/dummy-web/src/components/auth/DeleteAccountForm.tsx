import React, { useState } from 'react';
import { handleDeleteAccount } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function DeleteAccountForm() {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirmText !== "DELETE") {
      alert("Please type DELETE to confirm account deletion");
      return;
    }
    
    setLoading(true);
    try {
      const deleteResult = await handleDeleteAccount();
      setResult(deleteResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Delete Account</h2>
      <p className={styles.formWarning}>Warning: This action is irreversible!</p>
      <p className={styles.formNote}>You must be logged in to delete your account</p>
      
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Type "DELETE" to confirm:</label>
          <input
            className={styles.input}
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE"
            required
          />
        </div>
        <button 
          className={`${styles.button} ${confirmText === "DELETE" ? styles.dangerButton : ''}`}
          type="submit" 
          disabled={loading || confirmText !== "DELETE"}
        >
          {loading ? "Deleting..." : "Delete My Account"}
        </button>
      </form>
      
      {result && (
        <div className={`${styles.resultContainer} ${result.success ? styles.success : styles.error}`}>
          <h3>{result.success ? "Account Deleted" : "Failed to Delete Account"}</h3>
          {!result.success && <p>Error: {result.error?.toString()}</p>}
          {result.success && <p>Your account has been permanently deleted.</p>}
        </div>
      )}
    </div>
  );
}
