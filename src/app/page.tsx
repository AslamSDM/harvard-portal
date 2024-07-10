"use client";
import React from "react";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import {  useSession } from "next-auth/react";
import Dashboard from "@/components/Dashboard/Dashboard";
const Home: React.FC = () => {
  const router = useRouter();
  const session = useSession();


  if (!session.data?.user) {
    return <div>loading...</div>;
  } else {
    return (
      <div className={styles.home}>
        

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
