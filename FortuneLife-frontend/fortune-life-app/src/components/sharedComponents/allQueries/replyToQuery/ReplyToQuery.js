import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { answerQuery } from '../../../../services/queryService';
import Loader from '../../loader/Loader';


const ReplyToQuery = ({ query, setQuery, onClose }) => {
  const [response, setResponse] = useState(query.answer || '');
  const [loading, setLoading] = useState(false); // Loader state

  const handleChange = (e) => {
    setResponse(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); // Start loader
      const updatedQuery = { ...query, answer: response };
      await setQuery(updatedQuery);
      const newResponse = await answerQuery(updatedQuery);
      if (newResponse) {
        toast.info('Reply sent.');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to update query response');
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    marginBottom: '20px',
    textAlign: 'center',
  };

  const detailsStyle = {
    marginBottom: '20px',
  };

  const textAreaStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'vertical',
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
  };

  const btnPrimaryStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: '#fff',
  };

  const btnPrimaryHoverStyle = {
    ...btnPrimaryStyle,
    backgroundColor: '#0056b3',
  };

  const btnSecondaryStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: '#fff',
  };

  const btnSecondaryHoverStyle = {
    ...btnSecondaryStyle,
    backgroundColor: '#5a6268',
  };

  // Conditionally render Loader or Form content
  return (
    <div style={containerStyle}>
      {loading ? (
        <Loader /> 
      ) : (
        <>
          <h3 style={headingStyle}>Reply to Query</h3>
          <div style={detailsStyle}>
            <p><strong>Title:</strong> {query.title}</p>
            <p><strong>Question:</strong> {query.question}</p>
          </div>
          <div>
            <textarea
              style={textAreaStyle}
              value={response}
              onChange={handleChange}
              rows="6"
              placeholder="Type your answer here..."
            />
            <div style={buttonGroupStyle}>
              <button
                onClick={handleSubmit}
                style={btnPrimaryStyle}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = btnPrimaryHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = btnPrimaryStyle.backgroundColor)}
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReplyToQuery;
