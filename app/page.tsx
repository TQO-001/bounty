"use client";

import React, { useState, useEffect } from 'react';
import { addJob, getJobs } from './actions';

export default function JobTracker() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Pending");

  // Load from Database on start
  useEffect(() => {
    refreshJobs();
  }, []);

  const refreshJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position) return;

    await addJob({
      company,
      position,
      status,
      dateApplied: new Date().toISOString().split('T')[0]
    });

    // Reset and Close
    setCompany("");
    setPosition("");
    setStatus("Pending");
    setIsModalOpen(false);
    
    // Update List
    refreshJobs();
  };

  const stats = {
    total: jobs.length,
    interviewing: jobs.filter(j => j.status === 'Interviewing').length,
    offers: jobs.filter(j => j.status === 'Offer').length,
    successRate: jobs.length > 0 
      ? Math.round(((jobs.filter(j => j.status === 'Interviewing').length + jobs.filter(j => j.status === 'Offer').length) / jobs.length) * 100) 
      : 0
  };

  const filteredJobs = jobs.filter(j => 
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container">
      <div className="header">
        <h1>JOB APPLICATION TRACKER</h1>
        <div className="subtitle">Track Your Job Search Progress | Stay Organized, Stay Motivated</div>
      </div>

      <div className="stats-container">
        <div className="stat-card pending">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Applications</span>
        </div>
        <div className="stat-card interviewing">
          <span className="stat-number">{stats.interviewing}</span>
          <span className="stat-label">Active Interviews</span>
        </div>
        <div className="stat-card offer">
          <span className="stat-number">{stats.offers}</span>
          <span className="stat-label">Offers Received</span>
        </div>
        <div className="stat-card rejected">
          <span className="stat-number">{stats.successRate}%</span>
          <span className="stat-label">Success Rate</span>
        </div>
      </div>

      <div className="controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by company or position..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          + ADD NEW APPLICATION
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px'}}>No applications found!</td></tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.dateApplied}</td>
                  <td><strong>{job.company}</strong></td>
                  <td>{job.position}</td>
                  <td><span className={`status-badge ${job.status.toLowerCase()}`}>{job.status}</span></td>
                  <td><button className="action-btn">Edit</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Add New Application</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="text" placeholder="Company Name" required
                value={company} onChange={e => setCompany(e.target.value)}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <input 
                type="text" placeholder="Position" required
                value={position} onChange={e => setPosition(e.target.value)}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <select 
                value={status} onChange={e => setStatus(e.target.value)}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Pending">Pending</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="add-button" style={{ flex: 1 }}>Save Application</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ 
                  flex: 1, padding: '10px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' 
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}