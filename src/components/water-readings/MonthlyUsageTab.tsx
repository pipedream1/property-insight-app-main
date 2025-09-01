
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyUsage, WaterReading, ReservoirReading } from '@/types/waterReadings';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, LineChart, Line } from 'recharts';
import { MonthSelector } from './MonthSelector';
import { format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { VALID_WATER_SOURCES, SOURCE_COLORS } from '@/constants/waterSources';

interface MonthlyUsageTabProps {
  usageData: MonthlyUsage[];
  readings?: WaterReading[]; // optional raw readings for debug CSV export
  reservoirReadings?: ReservoirReading[]; // optional reservoir readings for level chart
}

export default function MonthlyUsageTab({ usageData, readings, reservoirReadings }: MonthlyUsageTabProps) {
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const toKL = (v: number) => v / 1000;
  const formatKL = (v: number) => {
    const abs = Math.abs(v);
    if (abs >= 1000) return Math.round(v).toLocaleString();
    if (abs >= 10) return v.toFixed(1);
    return v.toFixed(3);
  };
  
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
    const bySource: Record<string, number> = {};
    monthData.sources.forEach(s => { bySource[s.source] = s.usage; });
    // Build a full list across all defined sources, fill 0s for missing
  return VALID_WATER_SOURCES.map(src => ({
      name: src,
      usage: toKL(bySource[src] ?? 0),
      fill: SOURCE_COLORS[src as keyof typeof SOURCE_COLORS] || '#666666'
    }));
  }, [filteredUsageData]);
  const totalUsage = filteredUsageData.length > 0 ? filteredUsageData[0].total : 0;
  const totalUsageKL = toKL(totalUsage);

  // Reservoir chart data for the selected month
  const reservoirChartData = useMemo(() => {
    if (!reservoirReadings || reservoirReadings.length === 0) return [] as { date: Date; label: string; percentage: number; level: number }[];
    const monthFiltered = reservoirReadings
      .filter(r => isSameMonth(new Date(r.reading_date), selectedMonth))
      .sort((a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime());
    return monthFiltered.map(r => {
      const d = new Date(r.reading_date);
      return {
        date: d,
        label: format(d, 'd MMM'),
        percentage: Number(r.percentage_full ?? 0),
        level: Number(r.water_level ?? 0),
      };
    });
  }, [reservoirReadings, selectedMonth]);

  const exportMonthBreakdownCSV = () => {
    if (!readings || readings.length === 0 || filteredUsageData.length === 0) return;
    const monthData = filteredUsageData[0];
    const yy = monthData.year;
    const mm = new Date(Date.parse(monthData.month + ' 1, 2012')).getMonth() + 1;
    const monthStart = new Date(yy, mm - 1, 1);
    const monthEnd = new Date(yy, mm, 0);

    const rows: string[] = [];
    rows.push(['Source','StepIndex','FromDate','FromValue(L)','ToDate','ToValue(L)','Delta(L)','Delta(kL)','Note'].join(','));

    // Group all readings by canonical source
    const bySource: Record<string, WaterReading[]> = {};
    readings.forEach(r => {
      const src = r.component_type || r.source_name || r.component_name || 'Unknown';
      if (!VALID_WATER_SOURCES.includes(src)) return;
      (bySource[src] ||= []).push(r);
    });
    Object.values(bySource).forEach(list => list.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

    VALID_WATER_SOURCES.forEach(src => {
      const list = bySource[src] || [];
      if (list.length === 0) return;
      const before = list.filter(r => new Date(r.date).getTime() < monthStart.getTime());
      const inMonth = list.filter(r => {
        const t = new Date(r.date).getTime();
        return t >= monthStart.getTime() && t <= monthEnd.getTime();
      });

      const seq: { date: Date; val: number }[] = [];
      if (before.length > 0) {
        const prev = before[before.length - 1];
        seq.push({ date: new Date(prev.date), val: Number(prev.reading) || 0 });
      }
      inMonth.forEach(r => seq.push({ date: new Date(r.date), val: Number(r.reading) || 0 }));

      if (seq.length >= 2) {
        for (let i = 1; i < seq.length; i++) {
          const from = seq[i-1];
          const to = seq[i];
          const delta = to.val - from.val;
          const note = delta < 0 ? 'reset/rollback detected' : '';
          rows.push([
            src,
            String(i),
            from.date.toISOString().slice(0,10),
            String(Math.round(from.val)),
            to.date.toISOString().slice(0,10),
            String(Math.round(to.val)),
            String(Math.round(delta)),
            (delta/1000).toFixed(3),
            note
          ].join(','));
        }
      } else if (inMonth.length === 1 && before.length > 0) {
        // Single reading in month: baseline -> only
        const baseline = before[before.length - 1];
        const only = inMonth[0];
        const fromVal = Number(baseline.reading) || 0;
        const toVal = Number(only.reading) || 0;
        const delta = toVal - fromVal;
        rows.push([
          src,
          '1',
          new Date(baseline.date).toISOString().slice(0,10),
          String(Math.round(fromVal)),
          new Date(only.date).toISOString().slice(0,10),
          String(Math.round(toVal)),
          String(Math.round(delta)),
          (delta/1000).toFixed(3),
          ''
        ].join(','));
      }
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `water-usage-breakdown-${yy}-${String(mm).padStart(2,'0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
              {formatKL(totalUsageKL)} kL
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-3">
            Usage is calculated from increases in cumulative meter readings during the selected month. Raw readings are in liters; chart and totals are shown in kL.
          </p>
          {readings && readings.length > 0 && (
            <div className="mb-3">
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={exportMonthBreakdownCSV}
              >
                Export month breakdown (CSV)
              </button>
            </div>
          )}
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
                  <YAxis tickFormatter={(v) => formatKL(Number(v))} />
                  <Tooltip 
                    formatter={(value) => [`${formatKL(Number(value))} kL`, 'Usage']}
                    labelStyle={{ color: '#374151' }}
                    cursor={false}
                  />
                  <Legend />
                  <Bar 
                    dataKey="usage" 
                    name="Water Usage (kL)"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
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
          {VALID_WATER_SOURCES.map((src) => {
            const monthData = filteredUsageData[0];
            const found = monthData.sources.find(s => s.source === src);
            const usage = found ? found.usage : 0;
                const usageKL = toKL(usage);
            const color = SOURCE_COLORS[src as keyof typeof SOURCE_COLORS] || '#666666';
            return (
            <Card key={src}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-500">{src}</p>
                    <p className="text-2xl font-bold" style={{ color }}>
                      {formatKL(usageKL)} kL
                    </p>
                    <p className="text-sm text-gray-500">
                      {(() => {
                        if (totalUsage <= 0) return '0% of total';
                        const pct = (usage / totalUsage) * 100; // unit cancels
                        if (pct > 0 && pct < 1) return '<1% of total';
                        return `${Math.round(pct)}% of total`;
                      })()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}

      {/* Reservoir Levels over the selected month (moved below per-source figures) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Reservoir Levels - {format(selectedMonth, 'MMMM yyyy')}
            {reservoirChartData.length > 0 && (
              <span className="text-sm font-medium text-gray-500">{reservoirChartData.length} reading{reservoirChartData.length > 1 ? 's' : ''}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-3">
            Daily reservoir percentage full for the selected month. Values are from reservoir readings.
          </p>
          {reservoirChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reservoirChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" interval={0} angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'percentage') return [`${value.toFixed(0)}%`, 'Percent Full'];
                      if (name === 'level') return [`${value}`, 'Level'];
                      return [String(value), name];
                    }}
                    labelFormatter={(label: string) => label}
                    cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="percentage" name="Percent Full" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No reservoir level data for {format(selectedMonth, 'MMMM yyyy')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
