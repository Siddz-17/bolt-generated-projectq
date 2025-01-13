import React, { useState } from 'react';
    import axios from 'axios';
    import './index.css';
    import { FaYoutube } from 'react-icons/fa';

    function App() {
      const [videoUrl, setVideoUrl] = useState('');
      const [videoInfo, setVideoInfo] = useState(null);
      const [summary, setSummary] = useState('');
      const [question, setQuestion] = useState('');
      const [answer, setAnswer] = useState('');
      const [loadingSummary, setLoadingSummary] = useState(false);
      const [loadingAnswer, setLoadingAnswer] = useState(false);
      const [showSummary, setShowSummary] = useState(false);
      const [error, setError] = useState('');

      const handleVideoUrlChange = (event) => {
        setVideoUrl(event.target.value);
        setError('');
        setVideoInfo(null);
        setSummary('');
        setAnswer('');
        setShowSummary(false);
      };

      const fetchVideoInfo = async () => {
        try {
          const response = await axios.post('/api/video-info', { url: videoUrl });
          setVideoInfo(response.data);
        } catch (err) {
          setError('Failed to fetch video information. Please check the URL.');
          console.error('Error fetching video info:', err);
        }
      };

      const summarizeVideo = async () => {
        setLoadingSummary(true);
        setShowSummary(false);
        setSummary('');
        try {
          const response = await axios.post('/api/summarize', { url: videoUrl });
          setSummary(response.data.summary);
          setShowSummary(true);
        } catch (err) {
          setError('Failed to summarize video. Please try again.');
          console.error('Error summarizing video:', err);
        } finally {
          setLoadingSummary(false);
        }
      };

      const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
        setAnswer('');
      };

      const askQuestion = async () => {
        setLoadingAnswer(true);
        setAnswer('');
        try {
          const response = await axios.post('/api/answer', { summary: summary, question: question });
          setAnswer(response.data.answer);
        } catch (err) {
          setError('Failed to get an answer. Please try again.');
          console.error('Error answering question:', err);
        } finally {
          setLoadingAnswer(false);
        }
      };

      return (
        <div className="app-container">
          <h1><FaYoutube className="youtube-icon" /> Lexara AI</h1>
          <div className="input-area">
            <input
              type="text"
              placeholder="Enter YouTube Video URL"
              value={videoUrl}
              onChange={handleVideoUrlChange}
              className="url-input"
            />
            <button onClick={fetchVideoInfo} className="fetch-button">Fetch Video Info</button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {videoInfo && (
            <div className="video-info">
              <img src={videoInfo.thumbnail} alt={videoInfo.title} className="thumbnail" />
              <h2>{videoInfo.title}</h2>
              <button onClick={summarizeVideo} className="summarize-button" disabled={loadingSummary}>
                {loadingSummary ? 'Summarizing...' : 'Summarize'}
              </button>
            </div>
          )}
          {showSummary && summary && (
            <div className="summary-area">
              <h2>Summary</h2>
              <p className="summary-text">{summary}</p>
              <div className="question-area">
                <input
                  type="text"
                  placeholder="Ask a question about the video"
                  value={question}
                  onChange={handleQuestionChange}
                  className="question-input"
                />
                <button onClick={askQuestion} className="ask-button" disabled={loadingAnswer}>
                  {loadingAnswer ? 'Answering...' : 'Ask'}
                </button>
              </div>
              {answer && <p className="answer-text"><strong>Answer:</strong> {answer}</p>}
            </div>
          )}
        </div>
      );
    }

    export default App;
