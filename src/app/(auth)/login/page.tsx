
"use client"
import React, { useState } from 'react';
import styles from './Login.module.scss';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn('credentials', {
      email,
      password,
      redirect: true,
    })
    
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Harvard Admissions Portal Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='mb-3' type="submit">Login</button>
      <div>
        <button onClick={() => router.push('/signup')}>Sign Up</button>
      </div>
      </form>
    </div>
  );
};

export default Login;