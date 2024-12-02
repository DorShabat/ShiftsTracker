import React from 'react';
import './ShiftList.css'; // Ensure ShiftList.css exists

const getShiftType = (startTime) => {
  const hour = parseInt(startTime.split(':')[0], 10);
  if (hour >= 7 && hour < 15) return 'Morning';
  if (hour >= 15 && hour < 23) return 'Evening';
  if (hour >= 23 || hour < 7) return 'Night';
  return 'Other';
};

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
          <th>Shift Type</th> {/* New column for shift type */}
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
            <td>{getShiftType(shift.startTime)}</td> {/* Display shift type */}
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