import React from 'react';
import './Header.css'; // Ensure Header.css exists

const Header = ({ toggleSettings }) => (
  <header className="app-header">
    <h1>Shift Tracker</h1>
    <button className="settings-button" onClick={toggleSettings}>
      Settings
    </button>
  </header>
);

export default Header;