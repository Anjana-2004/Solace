import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="home">
      <h1>Welcome to MyApp</h1>
      <p>Select an option below:</p>
      <div className="options">
        <div className="option-card">
          <h2>Chatbot</h2>
          <p>Chat with our empathetic AI assistant.</p>
          <Link to="/chatbot" className="btn">Go to Chatbot</Link>
        </div>
        <div className="option-card">
          <h2>Quiz</h2>
          <p>Take a fun quiz to learn more about yourself.</p>
          <Link to="/quiz" className="btn">Go to Quiz</Link>
        </div>
        <div className="option-card">
          <h2>Sleep Schedule</h2>
          <p>Check out your sleep schedule.</p>
          <Link to="/sleep-schedule" className="btn">View Sleep Schedule</Link>
        </div>
      </div>
      <div className="info-sections">
        <section id="about">
          <h2>About Us</h2>
          <p>We are committed to enhancing both mental and physical well-being through supportive tools and expert-backed resources. Our platform offers stress management techniques, mindfulness exercises, and self-care strategies to foster emotional resilience. Additionally, we provide lifestyle tips and activity recommendations to promote overall health. By combining psychological support with physical wellness guidance, we empower individuals to lead balanced and fulfilling lives.</p>
        </section>
        <section id="contact" style={{ textAlign: 'center' }}>
          <h2>Contact Us</h2>
          <p>For any inquiries or support, feel free to reach out to us at info@myapp.com. We’re here to assist you with any questions, feedback, or concerns. Fill out the query form below, and our team will get back to you as soon as possible.</p>
          {submitted && <p className="success-message" style={{ marginBottom: '0px', marginTop: '10px' }}>Thank you! Your query has been submitted.</p>}
          <form className="query-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50%', margin: '0 auto' }}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', height: '40px' }} />
            
            <br /><br />
            
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', height: '40px' }} />
            
            <br /><br />
            
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required style={{ width: '100%', height: '40px' }} />
            
            <br /><br />
            
            <label htmlFor="message" style={{ display: 'inline-block', marginBottom: '5px' }}>Message:</label>
            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required style={{ width: '100%', height: '100px', display: 'inline-block', verticalAlign: 'top' }}></textarea>
            
            <br /><br />
            
            <button type="submit" className="btn">Submit</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Home;