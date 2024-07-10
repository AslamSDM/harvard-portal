// src/components/Upload/Upload.tsx

import React, { useState } from 'react';
import { uploadApplicants } from '../../services/api';
import styles from './Upload.module.scss';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      setUploading(true);
      setError(null);
      setSuccess(false);
      try {
        await uploadApplicants(file);
        setSuccess(true);
      } catch (err) {
        setError('Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.uploadForm}>
      <input type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>File uploaded successfully!</p>}
    </form>
  );
};

export default Upload;