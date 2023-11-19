import React, { useState } from 'react';



const SelectWithSearch = ({ options, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
  
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSelect = (option) => {
      setSelectedOption(option);
      onSelect(option);
    };
  
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
        <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <select
              className="form-select"
              value={selectedOption}
              onChange={(e) => handleSelect(e.target.value)}
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="" hidden>
                Search...
              </option>
              {filteredOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default SelectWithSearch;