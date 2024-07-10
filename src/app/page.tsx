"use client";
import React from 'react';
import styles from './page.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Dashboard from '@/components/Dashboard/Dashboard';

const Home: React.FC = () => {
  const router = useRouter();
  const session = useSession();

  const handleLogout = () => {
    signOut();
    if(!session.data?.user){
      router.push('/login');
    }
  };

if(!session.data?.user){
  return <div>loading...</div>
}else{
  console.log(session.data);
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>Harvard Admissions Portal</h1>
        <nav>
          <ul>
            <li><Link href="/">Dashboard</Link></li>
          </ul>
        </nav>
        <div className={styles.userInfo}>
          <span>Welcome, {session.data.user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </div>
      </header>

      <main className={styles.main}>
        <Dashboard />
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Test Harvard</p>
      </footer>
    </div>
  );
}

};

export default Home;