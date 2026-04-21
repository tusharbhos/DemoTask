import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="search-input-wrapper" style={{ maxWidth: '280px' }}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
