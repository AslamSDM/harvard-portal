"use client";

import React, { useState, useEffect } from 'react';
import styles from './ApplicationForm.module.scss';
import { useParams, useRouter } from 'next/navigation';

interface Application {
  id: number;
  name: string;
  email: string;
  description: string;
  essay?: string;
  recommendations?: string[];
  status: string;
}

const ApplicationForm: React.FC = () => {
  const router = useRouter()
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applicants?id=${id}`);
        const data = await response.json();
        console.log(data);
        setApplication(data.body);
      } catch (err) {
        setError('Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusChange = async (newStatus: Application['status']) => {
    if (application) {
      try {
        const response = await fetch(`/api/applicants/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id:id,status: newStatus }),
        });
        const updatedApplication = await response.json();
        if (response.status == 200) {
          router.push('/');
        }
        setApplication(updatedApplication.data);
      } catch (err) {
        setError('Failed to update application status');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!application) return <div>Application not found</div>;

  return (
    <div className={styles.applicationForm}>
      <h2>Application Review</h2>
      
      <section className={styles.personalInfo}>
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {application.name}</p>
        <p><strong>Email:</strong> {application.email}</p>
      </section>

      <section className={styles.essays}>
        <h3>Essays</h3>
          <div  className={styles.essay}>
            <p>{application.essay}</p>
          </div>
      </section>

      <section className={styles.recommendations}>
        <h3>Recommendations</h3>
        {application.recommendations && application.recommendations.map((rec, index) => (
          <div key={index} className={styles.recommendation}>
            <h4>{rec}</h4>
          </div>
        ))}
      </section>

      <section className={styles.decision}>
        <h3>Decision</h3>
        <p>Current Status: {application.status}</p>
        <div className={styles.decisionButtons}>
          <button onClick={() => handleStatusChange('APPROVED')} disabled={application.status === 'Approved'}>
            Approve
          </button>
          <button onClick={() => handleStatusChange('REJECTED')} disabled={application.status === 'Rejected'}>
            Reject
          </button>
          <button onClick={() => handleStatusChange('PENDING')} disabled={application.status === 'Pending'}>
            Mark as Pending
          </button>
        </div>
      </section>
    </div>
  );
};

export default ApplicationForm;