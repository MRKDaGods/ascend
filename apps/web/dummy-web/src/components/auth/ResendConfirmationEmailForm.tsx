import React, { useState } from 'react';
import { handleResendConfirmationEmail } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function ResendConfirmationEmailForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resendResult = await handleResendConfirmationEmail(email);
      setResult(resendResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Resend Confirmation Email</h2>
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
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Sending..." : "Resend Confirmation Email"}
        </button>
      </form>
      
      {result && (
        <div className={`${styles.resultContainer} ${result.success ? styles.success : styles.error}`}>
          <h3>{result.success ? "Email Sent Successfully" : "Failed to Send Email"}</h3>
          {!result.success && <p>Error: {result.error?.toString()}</p>}
          {result.success && <p>Confirmation email has been resent to {email}</p>}
        </div>
      )}
    </div>
  );
}
