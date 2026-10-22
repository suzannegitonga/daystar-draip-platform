import { useState } from 'react';
import axios from 'axios';

export default function SubmitAsset() {
  const [formData, setFormData] = useState({
    title: '',
    school: '',
    discipline: '',
    status: 'draft',
  });
  
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // Retrieve the saved JWT token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/assets', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'success') {
        setMessage('Asset submitted successfully!');
        setFormData({ title: '', school: '', discipline: '', status: 'draft' });
      }
    } catch (error) {
      setMessage('Error submitting asset: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Submit Research Asset</h2>
      
      {message && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9',
          color: message.includes('Error') ? '#c62828' : '#2e7d32',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title:</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>School:</label>
          <input 
            type="text" 
            name="school" 
            value={formData.school} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Discipline:</label>
          <input 
            type="text" 
            name="discipline" 
            value={formData.discipline} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Status:</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="draft">Draft</option>
            <option value="under review">Under Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '1rem', 
            backgroundColor: '#0056b3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          Submit to Register
        </button>
      </form>
    </div>
  );
}