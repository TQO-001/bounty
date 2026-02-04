"use client";

import React, { useState, useEffect } from 'react';
import { addJob, getJobs, deleteJob } from './actions';

export default function JobTracker() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    refreshJobs();
  }, []);

  const refreshJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const result = await addJob({
        company,
        position,
        status,
        dateApplied: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
      });

      if (result.success) {
        setCompany("");
        setPosition("");
        setStatus("Pending");
        setIsModalOpen(false);
        await refreshJobs();
      } else {
        alert("Server Error: " + result.error);
      }
    } catch (err) {
      alert("Network Error: Could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this application?")) {
      await deleteJob(id);
      await refreshJobs();
    }
  };

  const stats = {
    total: jobs.length,
    interviewing: jobs.filter(j => j.status === 'Interviewing').length,
    offers: jobs.filter(j => j.status === 'Offer').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length,
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '4px solid black', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>BOUNTY TRACKER</h1>
        <p>Job Application Management System</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', background: 'white', border: '2px solid black', borderLeft: '10px solid black' }}>
          <h3>Total</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</p>
        </div>
        <div style={{ padding: '20px', background: 'white', border: '2px solid black', borderLeft: '10px solid #fbbf24' }}>
          <h3>Interviewing</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.interviewing}</p>
        </div>
        <div style={{ padding: '20px', background: 'white', border: '2px solid black', borderLeft: '10px solid #22c55e' }}>
          <h3>Offers</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.offers}</p>
        </div>
        <div style={{ padding: '20px', background: 'white', border: '2px solid black', borderLeft: '10px solid #ef4444' }}>
          <h3>Rejected</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.rejected}</p>
        </div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
      >
        + Add Application
      </button>

      <div style={{ border: '2px solid black', background: 'white', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f8f8', borderBottom: '2px solid black' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Company</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Position</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>No applications found.</td></tr>
            ) : (
              jobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{job.company}</td>
                  <td style={{ padding: '12px' }}>{job.position}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      background: job.status === 'Offer' ? '#dcfce7' : job.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                      color: 'black',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{job.dateApplied}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleDelete(job.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', border: '4px solid black', width: '90%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '20px', textTransform: 'uppercase' }}>New Entry</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                placeholder="Company" 
                value={company} 
                onChange={e => setCompany(e.target.value)}
                style={{ padding: '12px', border: '2px solid black' }}
                required
              />
              <input 
                placeholder="Position" 
                value={position} 
                onChange={e => setPosition(e.target.value)}
                style={{ padding: '12px', border: '2px solid black' }}
                required
              />
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)}
                style={{ padding: '12px', border: '2px solid black', background: 'white' }}
              >
                <option value="Pending">Pending</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ padding: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {isSubmitting ? "SYNCING..." : "SAVE TO DATABASE"}
              </button>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}