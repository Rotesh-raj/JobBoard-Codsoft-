import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Users, Activity, PlusCircle, Bookmark, Settings } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    jobsPosted: 0,
    applicationsReceived: 0,
    jobsApplied: 0,
    savedJobs: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    // Simulate fetching dashboard data
    setTimeout(() => {
      if (user?.role === 'employer') {
        setStats({ jobsPosted: 3, applicationsReceived: 12, jobsApplied: 0, savedJobs: 0 });
      } else {
        setStats({ jobsPosted: 0, applicationsReceived: 0, jobsApplied: 5, savedJobs: 12 });
      }
    }, 800);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
      
      {/* SaaS Sidebar */}
      <aside style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{user.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <span style={{ display: 'inline-block', background: 'var(--primary-color)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              {user.role === 'employer' ? 'EMPLOYER' : 'CANDIDATE'}
            </span>
          </p>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--primary-color)', fontWeight: '600' }}>
              <Activity size={18} /> Overview
            </div>
            {user.role === 'employer' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <Briefcase size={18} /> My Postings
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <Users size={18} /> Candidates
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <FileText size={18} /> My Applications
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <Bookmark size={18} /> Saved Jobs
                </div>
              </>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)', marginTop: '2rem' }}>
              <Settings size={18} /> Account Settings
            </div>
          </nav>
        </div>
      </aside>

      {/* Main SaaS Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>{user.role === 'employer' ? 'Active Jobs' : 'Applied Jobs'}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{user.role === 'employer' ? stats.jobsPosted : stats.jobsApplied}</h2>
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'rgba(22, 101, 52, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--success-text)' }}>
              {user.role === 'employer' ? <Users size={24} /> : <Bookmark size={24} />}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>{user.role === 'employer' ? 'Total Applications' : 'Saved Jobs'}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{user.role === 'employer' ? stats.applicationsReceived : stats.savedJobs}</h2>
            </div>
          </div>

        </div>

        {/* Action / Empty State Area */}
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center' }}>
          
          {user.role === 'employer' ? (
            <>
              <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <PlusCircle size={48} color="var(--primary-color)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Post your first job</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem' }}>
                Start reaching thousands of candidates instantly. Create a job listing with details, requirements, and salary.
              </p>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={18} /> Create Job Post
              </button>
            </>
          ) : (
            <>
              <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <FileText size={48} color="var(--primary-color)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Your Application Hub</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem' }}>
                You haven't uploaded a resume or applied to any recent opportunities. Let's fix that!
              </p>
              <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                Browse Jobs Now
              </Link>
            </>
          )}

        </div>

      </main>
    </div>
  );
};

export default Dashboard;
