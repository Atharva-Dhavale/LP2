import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Ticket, CheckCircle, Search } from 'lucide-react';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('/api/registrations');
      setRegistrations(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load registrations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'VIP': return 'badge-vip';
      case 'Student': return 'badge-student';
      default: return 'badge-general';
    }
  };

  if (loading) {
    return <div className="loader-large"></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Overview of all event registrations.</p>
        </div>
        <button onClick={fetchRegistrations} className="btn btn-primary" style={{ width: 'auto' }}>
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="message message-error">
          <span>{error}</span>
        </div>
      )}

      <div className="dashboard-stats">
        <div className="glass-panel stat-card">
          <Users size={24} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
          <h3>Total Registrations</h3>
          <p>{registrations.length}</p>
        </div>
        <div className="glass-panel stat-card">
          <Ticket size={24} color="var(--secondary-color)" style={{ marginBottom: '1rem' }} />
          <h3>VIP Attendees</h3>
          <p>{registrations.filter(r => r.ticketType === 'VIP').length}</p>
        </div>
        <div className="glass-panel stat-card">
          <CheckCircle size={24} color="var(--success-color)" style={{ marginBottom: '1rem' }} />
          <h3>General Admission</h3>
          <p>{registrations.filter(r => r.ticketType === 'General Admission').length}</p>
        </div>
      </div>

      <div className="glass-panel table-container">
        {registrations.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <h3>No registrations yet</h3>
            <p>When users register, they will appear here.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Ticket Type</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg._id}>
                  <td style={{ fontWeight: 500 }}>{reg.fullName}</td>
                  <td>{reg.email}</td>
                  <td>{reg.phone}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(reg.ticketType)}`}>
                      {reg.ticketType}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
