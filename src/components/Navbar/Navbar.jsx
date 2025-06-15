import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen(!open);
    const closeMenu = () => setOpen(false);
    const linkClass = ({ isActive }) =>
        isActive ? 'nav-link active' : 'nav-link';

    return (
        <header className="navbar">
            {/* ── Brand ── */}
            <div className="logo">
                <div className="logo-icon">M</div>
                <span>Medi-Match AI</span>
            </div>

            {/* ── Hamburger (mobile) ── */}
            <button
                aria-label="Toggle navigation"
                className={`navbar__toggle ${open ? 'open' : ''}`}
                onClick={toggleMenu}
            >
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
            </button>

            {/* ── Navigation links ── */}
            <nav className={`navbar__menu ${open ? 'navbar__menu--open' : ''}`}>
                <ul>
                    <li><NavLink end to="/" className={linkClass} onClick={closeMenu}>Home</NavLink></li>
                    <li><NavLink to="/medical_analysis" className={linkClass} onClick={closeMenu}>Medical&nbsp;Analysis</NavLink></li>
                    <li><NavLink to="/clinical_trial" className={linkClass} onClick={closeMenu}>Clinical&nbsp;Trial</NavLink></li>
                    <li><NavLink to="/use_case" className={linkClass} onClick={closeMenu}>Uses</NavLink></li>
                    <li><NavLink to="/contributors" className={linkClass} onClick={closeMenu}>Contributors</NavLink></li>
                </ul>
            </nav >
        </header >
    );
}