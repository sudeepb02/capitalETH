import React from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';

function Nav() {

    return (
        <nav>
            <div className="logo">
                <Link to="/">capitalETH</Link>
            </div>
            <ul className="nav-links">
                <Link to='/dashboard'>
                    <li>Dashboard</li>
                </Link>
                <Link to='/about'>
                    <li>About</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Nav;
