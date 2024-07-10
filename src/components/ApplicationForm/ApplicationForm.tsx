import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApplication, updateApplication } from '../../services/api';
import styles from './ApplicationForm.module.scss';

interface Application {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  essays: {
    prompt: string;
    response: string;
  }[];
  recommendations: {
    recommenderName: string;
    relationship: string;
    content: string;
  }[];
  status: 'Pending' | 'Approved' | 'Rejected';
}

const ApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getApplication(id??"");
        setApplication(data);
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
        const updatedApplication = await updateApplication(application.id, { status: newStatus });
        setApplication(updatedApplication);
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
        <p><strong>Name:</strong> {application.personalInfo.name}</p>
        <p><strong>Email:</strong> {application.personalInfo.email}</p>
        <p><strong>Phone:</strong> {application.personalInfo.phone}</p>
      </section>

      <section className={styles.essays}>
        <h3>Essays</h3>
        {application.essays.map((essay, index) => (
          <div key={index} className={styles.essay}>
            <h4>Prompt: {essay.prompt}</h4>
            <p>{essay.response}</p>
          </div>
        ))}
      </section>

      <section className={styles.recommendations}>
        <h3>Recommendations</h3>
        {application.recommendations.map((rec, index) => (
          <div key={index} className={styles.recommendation}>
            <h4>{rec.recommenderName} - {rec.relationship}</h4>
            <p>{rec.content}</p>
          </div>
        ))}
      </section>

      <section className={styles.decision}>
        <h3>Decision</h3>
        <p>Current Status: {application.status}</p>
        <div className={styles.decisionButtons}>
          <button onClick={() => handleStatusChange('Approved')} disabled={application.status === 'Approved'}>
            Approve
          </button>
          <button onClick={() => handleStatusChange('Rejected')} disabled={application.status === 'Rejected'}>
            Reject
          </button>
          <button onClick={() => handleStatusChange('Pending')} disabled={application.status === 'Pending'}>
            Mark as Pending
          </button>
        </div>
      </section>
    </div>
  );
};

export default ApplicationForm;