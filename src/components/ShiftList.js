import React from 'react';
import './ShiftList.css'; // Ensure ShiftList.css exists

const ShiftList = ({ filteredShifts, handleDeleteShift }) => (
  <div className="shift-list">
    <h2>Shifts</h2>
    <table className="shifts-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Start</th>
          <th>End</th>
          <th>Hours Worked</th>
          <th>Earnings</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredShifts.map((shift) => (
          <tr key={shift.id}>
            <td>{shift.date}</td>
            <td>{shift.startTime}</td>
            <td>{shift.endTime}</td>
            <td>{shift.hoursWorked.toFixed(2)}</td>
            <td>{shift.earnings.toFixed(2)}₪</td>
            <td>
              <button className="delete-button" onClick={() => handleDeleteShift(shift.id)}>X</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ShiftList;