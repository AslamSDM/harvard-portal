// src/components/Dashboard/Dashboard.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import ApplicantStats from "../Charts/ApplicantStats";
import styles from "./Dashboard.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface Applicant {
  id: number;
  name: string;
  status: string;
}
const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'ACCEPTED':
      return { color: 'green' };
    case 'REJECTED':
      return { color: 'red' };
    case 'PENDING':
      return { color: 'orange' };
    default:
      return { color: 'black' }; // Default color
  }
};
const Dashboard: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter()
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetch("/api/applicants");
        const data = await response.json();
        console.log(data);
        setApplicants(data.body);
      } catch (err) {
        setError("Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);
  const handleExportCSV = async () => {
    const response = await fetch("/api/file/download");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv"; 
    document.body.appendChild(a); 
    a.click(); 
    URL.revokeObjectURL(url); 
    document.body.removeChild(a);
  };
  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
  };
  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();

    formData.append("file", file);
    const response = await fetch("/api/file/upload", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      setApplicants(data.body);
    } else {
      setError("Failed to upload file");
    }
  };
  useEffect(() => {
    if (file) {
      handleSubmit();
    }
  }, [file]);
  console.log(applicants);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.dashboard}>
      <h1>Admissions Dashboard</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleImportCSV}
        style={{ display: "none" }}
        id="csvImport"
        ref={fileInputRef}
      />
<button className="m-3" onClick={handleImportButtonClick} style={{ marginRight: '10px' }}>Import CSV</button>
<button onClick={handleExportCSV}>Export CSV</button>
      <ApplicantStats applicants={applicants} />
      <table className={styles.applicantTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length == 0 ? (
            <tr>
              <td colSpan={3}>No applicants found</td>
            </tr>
          ) : (
            applicants?.map((applicant) => (
              <tr style={getStatusStyle(applicant.status)} key={applicant.id} onClick={()=>router.push("/application/"+applicant.id)}>
                <td>{applicant.id}</td>
                <td>{applicant.name}</td>
                <td >{applicant.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
