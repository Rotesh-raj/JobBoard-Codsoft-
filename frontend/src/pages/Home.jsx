import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchJobs({});
  }, []);

  const fetchJobs = async ({ keyword = '', location = '' }) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/jobs?keyword=${keyword}&location=${location}`);
      setJobs(data.jobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center">
        <h1 className="title">Find Your Dream Job</h1>
        <p className="subtitle">Browse thousands of job openings from top companies.</p>
      </div>

      <SearchBar onSearch={fetchJobs} />

      <div className="jobs-section">
        <h2 className="section-title">Recent Jobs</h2>
        {loading ? (
          <div className="jobs-list">
            {[1, 2, 3].map(n => <div key={n} className="skeleton"></div>)}
          </div>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                  </div>
                  <span className="job-badge">{job.type}</span>
                </div>
                <div className="job-footer">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salaryRange}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
