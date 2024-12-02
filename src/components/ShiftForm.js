import React from 'react';
import './ShiftForm.css';

const ShiftForm = ({
  activeTab,
  form,
  handleChange,
  handleShiftClick,
  customShift,
  handleCustomShiftChange,
  handleAddCustomShift
}) => (
  <div className="shift-form">
    <form onSubmit={activeTab === 'custom' ? handleAddCustomShift : (e) => e.preventDefault()}>
      {/* ...existing code... */}
      
      {activeTab === 'regular' && (
        <>
          {/* Add Custom Date and Yesterday Checkboxes */}
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                id="customDate"
                checked={form.customDate}
                onChange={handleChange}
              />
              Custom Date
            </label>
            <label>
              <input
                type="checkbox"
                id="yesterday"
                checked={form.yesterday}
                onChange={handleChange}
              />
              Yesterday
            </label>
          </div>

          {/* Conditionally render the date picker if Custom Date is checked */}
          {form.customDate && (
            <label>
              Select Date:
              <input
                type="date"
                id="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>
          )}

          <div className="shift-buttons">
            <button type="button" onClick={() => handleShiftClick('morning')}>Morning Shift</button>
            <button type="button" onClick={() => handleShiftClick('evening')}>Evening Shift</button>
            <button type="button" onClick={() => handleShiftClick('night')}>Night Shift</button>
          </div>
        </>
      )}

      {activeTab === 'custom' && (
        <>
          <label>
            Date:
            <input
              type="date"
              id="date"
              value={customShift.date}
              onChange={handleCustomShiftChange}
              required
            />
          </label>
          <label>
            Hours Worked:
            <input
              type="number"
              id="hours"
              value={customShift.hours}
              onChange={handleCustomShiftChange}
              step="0.1"
              required
            />
          </label>
          <div className="shift-buttons">
            <button type="submit">Add Custom Shift</button>
          </div>
        </>
      )}
    </form>
  </div>
);

export default ShiftForm;
