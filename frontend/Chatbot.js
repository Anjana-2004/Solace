import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    // Append user's message to conversation
    setConversation(prev => [...prev, { sender: 'user', text: question }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await response.json();
      setConversation(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (error) {
      setConversation(prev => [...prev, { sender: 'bot', text: 'Error fetching response. Please try again.' }]);
    }
    
    setQuestion('');
    setLoading(false);
  };

  return (
    <div className="chatbot">
      <h1>Empathetic Chatbot</h1>
      <div className="chat-window">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && <p className="loading">The bot is typing...</p>}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="Ask me anything..." 
          required 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;
