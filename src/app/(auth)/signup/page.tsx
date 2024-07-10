
"use client"
import React, { useState } from 'react';
import styles from './Signup.module.scss';
import { signIn } from 'next-auth/react';
import { z } from 'zod'; 
import Email from 'next-auth/providers/email';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmpassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.password === data.confirmpassword, {
  message: "Passwords don't match",
  path: ["confirmpassword"], 
});
 const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const result = signupSchema.safeParse({ email,username, password ,confirmpassword});
    console.log(result.error?.issues);
    if (!result.success) {
      setError(result.error.issues.map(issue => issue.message).join(', '));
      return;
    }
    // If validation succeeds, proceed with form submission
    const response = await fetch('/api/user/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email,username, password }),
    });
    if (!response.ok) {
      setError('An error occurred. Please try again.');
      return;
    }
    signIn('credentials', {
      email,
      password,
      redirect: true,
    });
    const data = await response.json();


  };

  return (
    <div className={styles.SignupContainer}>
      <form onSubmit={handleSubmit} className={styles.SignupForm}>
        <h2>Harvard Admissions Portal Signup</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div>
          <label htmlFor="password">Confirm Password:</label>
          <input
            type="password"
            id="password"
            value={confirmpassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
export default Signup;