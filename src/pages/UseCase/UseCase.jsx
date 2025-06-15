import React from 'react';
import './UseCase.css';

const useCases = [
  {
    title: 'Cancer Research Trials',
    description:
      'Find cutting-edge cancer treatment trials including immunotherapy, targeted therapy, and experimental drug studies tailored to your specific cancer type and stage.',
    icon: '🧬',
  },
  {
    title: 'Neurological Disorders',
    description:
      "Discover trials for Alzheimer's, Parkinson’s, multiple sclerosis, and other neurological conditions with innovative treatments and breakthrough therapies.",
    icon: '🧠',
  },
  {
    title: 'Rare Disease Studies',
    description:
      'Access specialized trials for rare diseases and orphan conditions, connecting you with experimental treatments that may not be widely available.',
    icon: '🧪',
  }
];

const UseCase = () => {
  return (
    <section className="usecase-section">
      <h1 className="usecase-heading">Medi-Match AI Uses</h1>
      <p className="usecase-subtitle">Explore how Medi-Match AI connects you to clinical trials and research opportunities tailored to your needs</p>
      <hr className="usecase-divider" />
      <br /><br />
      <div className="usecase-grid">
        {useCases.map((useCase, index) => (
          <div className="usecase-card" key={index}>
            <div className="usecase-icon">{useCase.icon}</div>
            <h3 className="usecase-title">{useCase.title}</h3>
            <p className="usecase-description">{useCase.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UseCase;
