"use client";
import Image from "next/image"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./Navbar.module.scss"
import React from "react";

const Navbar : React.FC = () => {

    const router = useRouter();
    const session = useSession();
    const handleLogout = () => {
        signOut();
        if (!session.data?.user) {
          router.push("/login");
        }
      };
    if(!session.data?.user){
        return <></>
    }else{

    return(
    <>
        <header className={styles.header}>
          {/* <h1>Harvard 
          <br />
          Admission 
          <br />
          Portal</h1> */}
          <div className={styles.imageContainer}>
            <Image
              src={"/harvard.svg"}
              alt="Harvard Logo"
              objectFit="cover"
              layout="responsive"
              width={10}
              height={5}
            />
          </div>{" "}
          <nav>
            <ul>
              <li>
                <Link href="/">Dashboard</Link>
              </li>
            </ul>
          </nav>
          <div className={styles.userInfo}>
            {/* <span>Welcome, {session.data.user?.email}</span> */}
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </header>
              </>
    )
}

}
export default Navbar;