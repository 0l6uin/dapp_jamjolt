// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/trainpage">Train</Link></li>
                <li><Link to="/recpage">Recommendations</Link></li>
                <li><Link to="/postpage">Post</Link></li>
                <li><Link to="/ranking">Ranking</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;