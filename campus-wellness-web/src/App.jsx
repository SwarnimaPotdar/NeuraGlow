import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import FriendsConnect from "./components/FriendsConnect";
import MoodTracker from "./components/MoodTracker";
import "./styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">S</span>
          <h1>Serenity</h1>
        </div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/journal")}>Journal</button>
          <button className="nav-btn" onClick={() => navigate("/chat")}>AI Companion</button>
          <button className="nav-btn sos-btn" onClick={() => navigate("/sos")}>SOS</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <p className="hero-label">Serenity</p>
          <h2 className="hero-title">Find Your <br />Inner Peace</h2>
          <p className="hero-subtitle">Your sanctuary for mental wellness. Direct access to the tools that matter.</p>
        </div>

        {/* Feature Cards Grid */}
        <div className="feature-cards">
          {/* SOS Card */}
          <div className="feature-card sos-card" onClick={() => navigate("/sos")}>
            <div className="card-icon">🚨</div>
            <h3>SOS</h3>
            <p>Immediate crisis support</p>
          </div>

          {/* Mood Tracking Card */}
          <div className="feature-card mood-card" onClick={() => navigate("/mood")}>
            <div className="card-icon">✨</div>
            <h3>Mood Tracking</h3>
            <p>Track your emotional journey</p>
          </div>

          {/* Journaling Card */}
          <div className="feature-card journal-card" onClick={() => navigate("/journal")}>
            <div className="card-icon">📓</div>
            <h3>Journaling</h3>
            <p>Reflect and set goals</p>
          </div>

          {/* AI Companion Card */}
          <div className="feature-card chat-card" onClick={() => navigate("/chat")}>
            <div className="card-icon">🤖</div>
            <h3>AI Companion</h3>
            <p>Chat with AI support</p>
          </div>
        </div>

        {/* Breathing Exercises Banner */}
        <div className="breathing-banner">
          <div className="breathing-content">
            <span className="breathing-icon">↔️</span>
            <div className="breathing-text">
              <h4>Breathing Exercises</h4>
              <p>Calm your mind with guided breathing</p>
            </div>
          </div>
          <button className="start-btn">Start</button>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mood" element={<MoodTracker />} />
    </Routes>
  );
}
