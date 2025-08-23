
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyUsage } from '@/types/waterReadings';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthSelector } from './MonthSelector';
import { format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

interface MonthlyUsageTabProps {
  usageData: MonthlyUsage[];
}

export default function MonthlyUsageTab({ usageData }: MonthlyUsageTabProps) {
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  
  // Filter usage data for the selected month
  const filteredUsageData = useMemo(() => {
    return usageData.filter(usage => {
      const usageDate = new Date(usage.year, new Date(Date.parse(usage.month + " 1, 2012")).getMonth());
      return isSameMonth(usageDate, selectedMonth);
    });
  }, [usageData, selectedMonth]);

  // Transform data for the chart to show sources side by side
  const chartData = useMemo(() => {
    if (filteredUsageData.length === 0) return [];
    
    const monthData = filteredUsageData[0];
    return monthData.sources.map(source => ({
      name: source.source,
      usage: source.usage,
      fill: source.color
    }));
  }, [filteredUsageData]);

  const totalUsage = filteredUsageData.length > 0 ? filteredUsageData[0].total : 0;

  return (
    <div className="space-y-6">
      <MonthSelector 
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Water Usage - {format(selectedMonth, 'MMMM yyyy')}
            <span className="text-2xl font-bold text-blue-600">
              {totalUsage.toLocaleString()} kL
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} kL`, 'Usage']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="usage" 
                    name="Water Usage (kL)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No usage data available for {format(selectedMonth, 'MMMM yyyy')}
            </div>
          )}
        </CardContent>
      </Card>

      {filteredUsageData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredUsageData[0].sources.map((source) => (
            <Card key={source.source}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: source.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-500">{source.source}</p>
                    <p className="text-2xl font-bold" style={{ color: source.color }}>
                      {source.usage.toLocaleString()} kL
                    </p>
                    <p className="text-sm text-gray-500">
                      {totalUsage > 0 ? Math.round((source.usage / totalUsage) * 100) : 0}% of total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
