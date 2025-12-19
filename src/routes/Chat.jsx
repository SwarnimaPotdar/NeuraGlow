import { useState, useEffect, useRef, useCallback } from "react";
import ChatBubble from "../components/ChatBubble";
import { sendChatMessage } from "../services/geminiAPI";
import { useTheme } from "../context/ThemeContext";
import "../styles/components.css";

import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const Chat = () => {
  const { isLightMode, toggleTheme } = useTheme();
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [disabledSuggestions, setDisabledSuggestions] = useState(new Set());
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const chatListRef = useRef(null);
  const typingInputRef = useRef(null);

  const suggestions = [
    {
      text: "I'm feeling anxious right now. Can you help me calm down?",
      icon: "favorite"
    },
    {
      text: "Guide me through a short grounding or breathing exercise.",
      icon: "self_improvement"
    },
    {
      text: "How can I improve my mental health day by day?",
      icon: "psychology"
    },
    {
      text: "I'm feeling overwhelmed and burned out.",
      icon: "spa"
    }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load saved chats from localStorage
    const savedChats = localStorage.getItem('savedChats');
    if (savedChats) {
      try {
        const parsedMessages = JSON.parse(savedChats);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved chats:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever messages change (debounced)
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('savedChats', JSON.stringify(messages));
      }, 300); // Debounce localStorage writes

      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatListRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        chatListRef.current.scrollTo({
          top: chatListRef.current.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Hide/show suggestions based on scroll position and message state
    const handleScroll = () => {
      if (chatListRef.current) {
        const scrollTop = chatListRef.current.scrollTop;

        // If there are messages, keep suggestions hidden permanently
        if (messages.length > 0) {
          setHideSuggestions(true);
          return;
        }

        // If no messages, hide suggestions only when scrolled down > 50px
        const shouldHide = scrollTop > 50;
        setHideSuggestions(shouldHide);
      }
    };

    const chatList = chatListRef.current;
    if (chatList) {
      chatList.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();

      return () => chatList.removeEventListener('scroll', handleScroll);
    }
  }, [messages.length]);

  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'outgoing',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          userId,
          domain: 'mental_health',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const cleaned = data.reply.replace(/\*\*(.*?)\*\*/g, '$1');

      // Show response immediately without artificial delay
      const aiMessage = {
        id: Date.now() + 1,
        type: 'incoming',
        content: cleaned,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'incoming',
        content: err.name === 'AbortError' ? 'Request timed out. Please try again.' : err.message,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  }, [isTyping, userId]);

  const handleSuggestionClick = useCallback((suggestion) => {
    if (disabledSuggestions.has(suggestion.text)) return;

    setDisabledSuggestions(prev => new Set([...prev, suggestion.text]));
    handleSendMessage(suggestion.text);
  }, [disabledSuggestions, handleSendMessage]);

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear this conversation?')) {
      setMessages([]);
      setDisabledSuggestions(new Set());
      localStorage.removeItem('savedChats');
    }
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  }, [inputValue, handleSendMessage]);

  const copyMessage = useCallback((content) => {
    navigator.clipboard.writeText(content);
  }, []);

  return (
    <>
      <header className="header">
        <h2 className="title">You're not alone 🤍</h2>
        <h4 className="subtitle">
          A safe space to talk about your mental health and well-being
        </h4>

        {!hideSuggestions && (
          <ul className="suggestion-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`suggestion ${disabledSuggestions.has(suggestion.text) ? 'disabled' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <h4 className="text">{suggestion.text}</h4>
                <span className="icon material-symbols-rounded">{suggestion.icon}</span>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="chat-list" ref={chatListRef}>
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="avatar">
                {message.type === 'outgoing' ? '👤' : '🤖'}
              </div>
              <p className={`text ${message.isError ? 'error' : ''}`}>
                {message.content}
              </p>
              {message.type === 'incoming' && !message.isError && (
                <span
                  onClick={() => copyMessage(message.content)}
                  className="icon material-symbols-rounded"
                  title="Copy message"
                >
                  content_copy
                </span>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message incoming loading">
            <div className="message-content">
              <div className="avatar">
                🤖
              </div>
              <p className="text">
                <div className="loading-indicator">
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                  <div className="loading-bar"></div>
                </div>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="typing-area">
        <form className="typing-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Share what's on your mind..."
              className="typing-input"
              ref={typingInputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
            <button type="submit" className="icon material-symbols-rounded" disabled={isTyping}>
              send
            </button>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="theme-toggle icon"
              aria-pressed={isLightMode}
              title={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
              onClick={toggleTheme}
            >
              {isLightMode ? '🌙' : '☀️'}
            </button>

            <span
              className="icon material-symbols-rounded"
              title="Clear conversation"
              onClick={handleClearChat}
            >
              delete
            </span>
          </div>
        </form>

        <p className="disclaimer-text">
          This assistant provides mental health support and wellness guidance but
          is not a replacement for professional care. If you're in crisis,
          please seek immediate help.
        </p>
      </div>
    </>
  );
};

export default Chat;
