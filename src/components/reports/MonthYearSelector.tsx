
import React from 'react';

interface MonthYearSelectorProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear
}) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <select 
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <select 
        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {[2025, 2024, 2023].map(year => (
          <option key={year} value={year.toString()}>{year}</option>
        ))}
      </select>
    </div>
  );
};
