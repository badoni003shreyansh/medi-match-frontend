import React from 'react';
import './Contributors.css';

// 👉  Replace avatar/social links with real data
const contributors = [
  {
    name: 'Abde Kuvazar',
    // role: 'AI Research Lead',
    avatar: 'https://i.pravatar.cc/150?img=12',
    linkedin: 'https://www.linkedin.com/in/lakshya-jangid-3b5453300/',
    github: 'https://github.com/lakshyajangid28',
  },
  {
    name: 'Lakshya Jangid',
    // role: 'Full‑Stack Engineer',
    avatar: '/lakshya.jpeg',
    linkedin: 'https://www.linkedin.com/in/lakshya-jangid-3b5453300/',
    github: 'https://github.com/lakshyajangid28',
  },
  {
    name: 'Shreyansh Badoni',
    // role: 'Data Scientist',
    avatar: '/badoni.jpeg',
    linkedin: 'https://www.linkedin.com/in/shreyansh-badoni-679062266/',
    github: 'https://github.com/badoni003shreyansh',
  },
];
/* ── Inline SVG icons – no dependencies ────────────────────────── */
const GitHubIcon = ({ size = 20 }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false"
  >
    <path d="M12 0C5.73 0 0 5.73 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.57v-2.24c-3.34.73-4.03-1.42-4.03-1.42-.55-1.38-1.34-1.75-1.34-1.75-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.31.76-1.61-2.67-.31-5.48-1.34-5.48-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.62-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.8.58A12 12 0 0 0 24 12c0-6.27-5.73-12-12-12Z" />
  </svg>
);

const LinkedInIcon = ({ size = 20 }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
    aria-hidden="true" focusable="false"
  >
    <path d="M4.98 3.5C4.98 5 3.92 6 2.5 6S0 5 0 3.5 1.08 1 2.5 1s2.48 1 2.48 2.5ZM.5 8.5h4V23h-4Zm7.5 0h3.84v2h.06a4.21 4.21 0 0 1 3.79-2.08c4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.31c0-1.74 0-3.97-2.42-3.97S12 13.59 12 15.6V23H8.5Z" />
  </svg>
);

export default function Contributors() {
  return (
    <section className="contributors">
      <h1 className="contributors__heading">Meet the Team</h1>
      <p className="contributors__subtitle">
        The passionate minds behind Medi-Match AI, dedicated to advancing
        healthcare through technology and research.
      </p>
      <hr className="usecase-divider" />

      <div className="contributors__grid">
        {contributors.map((person) => (
          <div className="contributor-card" key={person.github}>
            <img
              className="contributor-card__avatar"
              src={person.avatar}
              alt={`${person.name}'s avatar`}
            />
            <h3 className="contributor-card__name">{person.name}</h3>
            <p className="contributor-card__role">{person.role}</p>

            <div className="contributor-card__links">
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} LinkedIn`}
              >
                <LinkedInIcon size={20} />
              </a>
              <a
                href={person.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} GitHub`}
              >
                <GitHubIcon size={20} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
