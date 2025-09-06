import React from 'react';
import './TimePeriodSelector.css';

interface TimePeriodSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange
}) => {
  // Generate years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

  // Month options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  return (
    <div className="time-period-selector">
      <div className="selector-header">
        <h3 className="selector-title">Time Period</h3>
      </div>
      
      <div className="selector-controls">
        <div className="selector-group">
          <label htmlFor="year-select" className="selector-label">Year</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="selector-dropdown"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <div className="selector-group">
          <label htmlFor="month-select" className="selector-label">Month</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className="selector-dropdown"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TimePeriodSelector;
