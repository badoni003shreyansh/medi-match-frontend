import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <main className="home">
      <div className="home__container">
        <div className="home__content">
          <h1 className="home__title">
            Your 24/7 AI Companion for
            <br />
            <span className="home__title-gradient">
              Clinical Trial Discovery & Medical
              <br />
              Research Matching
            </span>
          </h1>

          <p className="home__description">
            Our AI agents integrate with leading medical databases and research platforms to help you discover
            <br />
            relevant clinical trials, connect with research opportunities, and find potential treatments—cutting
            <br />
            research time by 70%+ while expanding your healthcare options.
          </p>

          <p className="home__disclaimer">
            No credit card required • Free clinical trial matching
          </p>
        </div>
      </div>
    </main>
  );
}