import React from 'react';

const EventFilter = ({ 
  activeTab, 
  setActiveTab, 
  tabs, 
  searchQuery, 
  setSearchQuery, 
  dropdownValue, 
  setDropdownValue, 
  dropdownOptions, 
  placeholder = "Search events..." 
}) => {
  return (
    <section className="filter-toolbar">
      {/* Category Tabs */}
      <div className="category-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.value}
            className={`tab-btn ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input and Optional Context Dropdown */}
      <div className="search-filter-box">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder={placeholder} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {dropdownOptions && setDropdownValue && (
          <select 
            className="genre-select" 
            value={dropdownValue}
            onChange={(e) => setDropdownValue(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            {dropdownOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </section>
  );
};

export default EventFilter;
