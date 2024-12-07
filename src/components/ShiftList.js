import React, { useState } from 'react';
import './ShiftList.css'; // Ensure ShiftList.css exists

const getShiftType = (startTime) => {
  const hour = parseInt(startTime.split(':')[0], 10);
  if (hour >= 7 && hour < 15) return 'Morning';
  if (hour >= 15 && hour < 23) return 'Evening';
  if (hour >= 23 || hour < 7) return 'Night';
  return 'Other';
};

const ShiftList = ({ filteredShifts, handleDeleteShift, handleUpdateShift }) => {
  const [editShiftId, setEditShiftId] = useState(null);
  const [editShift, setEditShift] = useState({ startTime: '', endTime: '' });

  const handleEditClick = (shift) => {
    setEditShiftId(shift.id);
    setEditShift({ startTime: shift.startTime, endTime: shift.endTime });
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditShift({ ...editShift, [id]: value });
  };

  const handleSaveClick = (shift) => {
    handleUpdateShift(shift.id, editShift.startTime, editShift.endTime);
    setEditShiftId(null);
  };

  return (
    <div className="shift-list">
      <h2>Shifts</h2>
      <table className="shifts-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Shift Type</th> {/* Move shift type column here */}
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
              <td>{getShiftType(shift.startTime)}</td> {/* Display shift type */}
              <td>
                {editShiftId === shift.id ? (
                  <input
                    type="time"
                    id="startTime"
                    value={editShift.startTime}
                    onChange={handleEditChange}
                  />
                ) : (
                  shift.startTime
                )}
              </td>
              <td>
                {editShiftId === shift.id ? (
                  <input
                    type="time"
                    id="endTime"
                    value={editShift.endTime}
                    onChange={handleEditChange}
                  />
                ) : (
                  shift.endTime
                )}
              </td>
              <td>{shift.hoursWorked.toFixed(2)}</td>
              <td>{shift.earnings.toFixed(2)}₪</td>
              <td>
                {editShiftId === shift.id ? (
                  <button onClick={() => handleSaveClick(shift)}>Save</button>
                ) : (
                  <button onClick={() => handleEditClick(shift)}>Edit</button>
                )}
                <button className="delete-button" onClick={() => handleDeleteShift(shift.id)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftList;