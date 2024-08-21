import React, { useState } from 'react';
import axios from 'axios';
import { BsFillSendArrowUpFill } from "react-icons/bs";
import './App.css';
import { FaSquarespace } from "react-icons/fa";

const API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placeholderActive, setPlaceholderActive] = useState(true);

  const fetchCompletion = async () => {
    if (!userInput) return; // Prevent empty submissions

    setLoading(true);
    try {
      const response = await axios.post(
        BASE_URL,
        {
          model: "meta/llama-3.1-405b-instruct",
          messages: [{ role: "user", content: userInput }],
          temperature: 0.2,
          top_p: 0.7,
          max_tokens: 1024,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: ["string"]
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const data = response.data;
      const content = data.choices[0]?.message?.content || 'No response content';

      // Add the question and response to the chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { question: userInput, response: content },
      ]);

      setUserInput(''); // Clear the input field

    } catch (error) {
      console.error('Error fetching completion:', error.response ? error.response.data : error.message);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { question: userInput, response: 'Error fetching response' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default behavior (new line)
      fetchCompletion(); // Trigger the button action
    }
  };

  const handleFocus = () => {
    setPlaceholderActive(false);
  };

  const handleBlur = () => {
    if (!userInput) {
      setPlaceholderActive(true);
    }
  };

  return (
    <div className="App">
      <div className="MainContainer">
        <h3>Welcome to NVIDIA NEMO API Integration Example</h3>
        {/* Input Section */}
        <div className="input-container">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={placeholderActive ? "How can we assist you today?" : ""}
            rows="1"
            className="input-textarea"
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button
            onClick={fetchCompletion}
            disabled={loading}
            className="fetch-button"
          >
            {loading ? (
              <BsFillSendArrowUpFill style={{ color: 'gray', fontSize: '20px' }} />
            ) : (
              <BsFillSendArrowUpFill style={{ color: 'black', fontSize: '24px' }} />
            )}
          </button>
        </div>
    
        {/* Chat Container */}
        <div className="ChatContainer">
          {/* Chat History */}
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-entry">
                <h4><strong>Question:</strong> {chat.question}</h4>
                <div className='chat-response'>
                  <p><strong><FaSquarespace /></strong> {chat.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
