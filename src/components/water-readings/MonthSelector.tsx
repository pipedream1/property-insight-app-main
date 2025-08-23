
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subMonths, startOfMonth } from 'date-fns';

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export const MonthSelector = ({ selectedMonth, onMonthChange }: MonthSelectorProps) => {
  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    return startOfMonth(subMonths(new Date(), i));
  });

  return (
    <div className="flex items-center gap-2 mb-4">
      <label className="text-sm font-medium text-gray-700">Select Month:</label>
      <Select
        value={format(selectedMonth, 'yyyy-MM')}
        onValueChange={(value) => {
          const [year, month] = value.split('-');
          onMonthChange(new Date(parseInt(year), parseInt(month) - 1, 1));
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={format(month, 'yyyy-MM')} value={format(month, 'yyyy-MM')}>
              {format(month, 'MMMM yyyy')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
