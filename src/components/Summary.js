import React from 'react';
import './Summary.css';

const Summary = ({ selectedMonth, totalHours, targetHours, progressPercentage, totalEarnings }) => (
  <div className="summary">
    <h3>Monthly Summary for {selectedMonth}</h3>
    <p>Hours Worked: {totalHours.toFixed(2)} / {targetHours} hours</p>
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
    </div>
    <p>Earnings: {totalEarnings.toFixed(2)}₪</p>
  </div>
);

export default Summary;