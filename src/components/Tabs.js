import React from 'react';
import './Tabs.css';

const Tabs = ({ activeTab, handleTabClick }) => {
  return (
    <div className="tabs">
      <button
        className={activeTab === 'regular' ? 'active' : ''}
        onClick={() => handleTabClick('regular')}
      >
        Regular Shift
      </button>
      <button
        className={activeTab === 'custom' ? 'active' : ''}
        onClick={() => handleTabClick('custom')}
      >
        Custom Shift
      </button>
    </div>
  );
};

export default Tabs;