"use client";

import React, { useState, useEffect } from 'react';

export default function JobTracker() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Load data from localStorage (like your HTML did)
  useEffect(() => {
    const savedJobs = localStorage.getItem('jobApplications');
    if (savedJobs) setJobs(JSON.parse(savedJobs));
  }, []);

  const stats = {
    total: jobs.length,
    interviewing: jobs.filter(j => j.status === 'Interviewing').length,
    offers: jobs.filter(j => j.status === 'Offer').length,
    successRate: jobs.length > 0 ? Math.round(((jobs.filter(j => j.status === 'Interviewing').length + jobs.filter(j => j.status === 'Offer').length) / jobs.length) * 100) : 0
  };

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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-button" onClick={() => alert('Logic for adding coming soon!')}>
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
            {jobs.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px'}}>No applications yet!</td></tr>
            ) : (
              jobs.filter(j => j.company.toLowerCase().includes(searchTerm.toLowerCase())).map((job, i) => (
                <tr key={i}>
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
    </main>
  );
}