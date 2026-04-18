import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    companyName: ''
  });
  const [error, setError] = useState('');
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Quick validation
    if (formData.role === 'employer' && !formData.companyName) {
      setError('Company Name is required for Employers.');
      return;
    }

    const success = await registerUser(formData);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed. Email might be in use.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '2rem' }}>
      <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
            <input type="text" name="name" required className="search-input" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <input type="email" name="email" required className="search-input" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input type="password" name="password" required className="search-input" value={formData.password} onChange={handleChange} minLength={6} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>I am a...</label>
            <select name="role" className="search-input" value={formData.role} onChange={handleChange}>
              <option value="candidate">Candidate (Looking for jobs)</option>
              <option value="employer">Employer (Hiring)</option>
            </select>
          </div>

          {formData.role === 'employer' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Company Name</label>
              <input type="text" name="companyName" required className="search-input" value={formData.companyName} onChange={handleChange} />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Sign Up</button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
