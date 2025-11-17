import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/me/');
      setUserData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {userData?.username || 'User'}!</h2>
          <p>Email: {userData?.email || 'N/A'}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Projects</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Active Tasks</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
