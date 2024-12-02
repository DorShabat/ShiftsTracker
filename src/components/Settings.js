import React from 'react';
import './Settings.css'; // Ensure Settings.css exists

const Settings = ({ tempProfile, handleTempProfileChange, handleUpdateProfile, toggleSettings }) => (
  <div className="settings-modal">
    <h2>Settings</h2>
    <form onSubmit={handleUpdateProfile}>
      {/* ...existing code... */}
      <label>
        Hourly Rate:
        <input
          type="number"
          id="hourlyRate"
          value={tempProfile.hourlyRate}
          onChange={handleTempProfileChange}
          step="1"
          required
        />
      </label>
      <label>
        Monthly Hours:
        <input
          type="number"
          id="monthlyHours"
          value={tempProfile.monthlyHours}
          onChange={handleTempProfileChange}
          step="1"
          required
        />
      </label>
      <label>
        Full-Time Percentage:
        <input
          type="number"
          id="fullTimePercentage"
          value={tempProfile.fullTimePercentage}
          onChange={handleTempProfileChange}
          step="1"
          required
        />
      </label>
      <button type="submit">Save</button>
      <button type="button" className="close-settings" onClick={toggleSettings}>
        Close
      </button>
    </form>
  </div>
);

export default Settings;
