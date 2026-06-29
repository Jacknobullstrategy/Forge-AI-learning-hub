import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/Login.css';

export function Login({ onSuccess }) {
  const { login, register, error: authError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Data Analyst',
    industry: 'Tech',
    department: 'Analytics',
  });

  const roles = ['Data Analyst', 'Manager', 'Engineer', 'Designer', 'Marketer', 'CEO', 'Sales Rep', 'HR Manager', 'Product Manager'];
  const industries = ['Finance', 'Tech', 'Healthcare', 'Retail', 'Education', 'Manufacturing', 'Media', 'Government'];
  const departments = ['Analytics', 'Operations', 'Marketing', 'Sales', 'HR', 'Engineering', 'Design', 'Product'];

  useEffect(() => {
    setError(null);
  }, [isSignUp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let success;
      if (isSignUp) {
        success = await register(
          formData.email,
          formData.password,
          formData.role,
          formData.industry,
          formData.department
        );
      } else {
        success = await login(formData.email, formData.password);
      }

      if (success) {
        onSuccess();
      } else {
        setError(authError || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>AI for Work</h1>
        <p className="subtitle">{isSignUp ? 'Create your account' : 'Sign in to your account'}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="role">Your Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                >
                  {industries.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-toggle">
          <span>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="toggle-btn"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
