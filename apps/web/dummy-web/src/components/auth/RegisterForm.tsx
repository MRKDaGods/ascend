import React, { useState } from 'react';
import { handleRegister } from '../../services/auth/handlers';
import styles from '../../styles/form.module.css';

export function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registerResult = await handleRegister(
        firstName,
        lastName,
        email,
        password
      );
      setResult(registerResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Register New User</h2>
      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>First Name</label>
          <input
            className={styles.input}
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            className={styles.input}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </div>
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      
      {result && (
        <div className={`${styles.resultContainer} ${result.success ? styles.success : styles.error}`}>
          <h3>{result.success ? "Registration Successful" : "Registration Failed"}</h3>
          {result.success ? (
            <pre className={styles.preContainer}>{JSON.stringify(result, null, 2)}</pre>
          ) : (
            <p>Error: {result.error?.toString()}</p>
          )}
        </div>
      )}
    </div>
  );
}
