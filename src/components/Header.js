import React from 'react';
import './Header.css'; // Ensure Header.css exists
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const Header = ({ user, toggleSettings }) => (
  <header className="app-header">
    <h1>Shift Tracker</h1>
    <div className="header-right">
      <span className="greeting">Hello {user?.email}</span> {/* Display user's email */}
      <button className="settings-button" onClick={toggleSettings}>
        <FontAwesomeIcon icon={faCog} /> {/* Only the settings icon */}
      </button>
    </div>
  </header>
);

export default Header;