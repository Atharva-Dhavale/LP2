import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ticketType: 'General Admission'
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post('/api/register', formData);
      setStatus({ type: 'success', message: response.data.message });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        ticketType: 'General Admission'
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Something went wrong. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel form-container">
      <div className="form-header">
        <h1>Join the Event</h1>
        <p>Secure your spot at the biggest tech conference of the year.</p>
      </div>

      {status.message && (
        <div className={`message message-${status.type}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticketType">Ticket Type</label>
          <select
            id="ticketType"
            name="ticketType"
            className="form-control"
            value={formData.ticketType}
            onChange={handleChange}
            required
          >
            <option value="General Admission">General Admission - $99</option>
            <option value="VIP">VIP Access - $299</option>
            <option value="Student">Student Pass - $49</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <div className="loader"></div> : 'Register Now'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
