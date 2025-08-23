
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Droplets, Plus, TrendingUp, TrendingDown, Minus, Gauge, BarChart3, Edit3 } from 'lucide-react';
import { ReservoirReading } from '@/hooks/useWaterReadings';
import { AddReservoirReadingDialog } from './AddReservoirReadingDialog';

interface ReservoirCardProps {
  readings: ReservoirReading[];
  onReadingAdded: () => void;
}

export const ReservoirCard = ({ readings, onReadingAdded }: ReservoirCardProps) => {
  const [isAddingReading, setIsAddingReading] = useState(false);
  const [isEditingReading, setIsEditingReading] = useState(false);
  
  // Use actual readings from database, fallback to default values if no readings exist
  const latestReading = readings.length > 0 
    ? readings.sort((a, b) => new Date(b.reading_date).getTime() - new Date(a.reading_date).getTime())[0]
    : {
        id: 'default',
        reading_date: new Date().toISOString(),
        water_level: 4.0, // Default physical depth: 4 meters
        percentage_full: 80.0, // Default electronic meter reading
        notes: 'Default reading - Please add actual measurements',
        created_at: new Date().toISOString()
      };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Low';
    return 'Critical';
  };

  const getTrend = () => {
    if (readings.length < 2) return null;
    
    const sortedReadings = readings.sort((a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime());
    const latest = sortedReadings[sortedReadings.length - 1];
    const previous = sortedReadings[sortedReadings.length - 2];
    
    const diff = latest.percentage_full - previous.percentage_full;
    
    if (diff > 2) return { trend: 'up', icon: TrendingUp, color: 'text-green-600' };
    if (diff < -2) return { trend: 'down', icon: TrendingDown, color: 'text-red-600' };
    return { trend: 'stable', icon: Minus, color: 'text-gray-600' };
  };

  const getCorrelationAccuracy = (percentage: number, depth: number) => {
    // Assuming reservoir is 5m total depth, so 4m = 80% when full
    const expectedPercentage = (depth / 5) * 100;
    const variance = Math.abs(expectedPercentage - percentage);
    if (variance < 5) return { text: 'Excellent', color: 'text-green-600' };
    if (variance < 10) return { text: 'Good', color: 'text-yellow-600' };
    return { text: 'Needs Calibration', color: 'text-red-600' };
  };

  const trend = getTrend();
  const correlation = latestReading ? getCorrelationAccuracy(latestReading.percentage_full, latestReading.water_level) : null;

  return (
    <>
      <Card className="relative overflow-hidden border-0 shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span>Reservoir</span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditingReading(true)}
                className="h-8"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                onClick={() => setIsAddingReading(true)}
                className="h-8 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Reading
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Main Status Display */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={getStatusColor(latestReading.percentage_full)}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={`${latestReading.percentage_full}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{latestReading.percentage_full.toFixed(1)}%</span>
                  <span className="text-sm text-muted-foreground">{latestReading.water_level}m deep</span>
                </div>
              </div>
              
              <Badge variant="outline" className={`${getStatusColor(latestReading.percentage_full)} text-white border-0 px-4 py-1`}>
                {getStatusText(latestReading.percentage_full)}
              </Badge>
            </div>

            {/* Detailed Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center border-2 border-blue-200">
                <div className="flex items-center justify-center mb-1">
                  <Gauge className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-800 font-medium">Electronic Meter</span>
                </div>
                <div className="text-lg font-bold text-blue-900">{latestReading.percentage_full.toFixed(1)}%</div>
                <div className="text-xs text-blue-700 mt-1">Last Reading</div>
              </div>
              
              <div className="bg-cyan-50 rounded-lg p-3 text-center border-2 border-cyan-200">
                <div className="flex items-center justify-center mb-1">
                  <BarChart3 className="h-4 w-4 text-cyan-600 mr-1" />
                  <span className="text-sm text-cyan-800 font-medium">Physical Depth</span>
                </div>
                <div className="text-lg font-bold text-cyan-900">{latestReading.water_level}m</div>
                <div className="text-xs text-cyan-700 mt-1">Measured Depth</div>
              </div>
            </div>

            {/* Correlation Status */}
            {correlation && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Meter Correlation</span>
                  <span className={`text-sm font-bold ${correlation.color}`}>{correlation.text}</span>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Electronic meter vs physical depth measurement accuracy
                </div>
              </div>
            )}

            {/* Trend Display */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Trend</span>
              <div className="flex items-center gap-1">
                {trend && <trend.icon className={`h-4 w-4 ${trend.color}`} />}
                <span className={trend?.color || 'text-gray-600'}>
                  {trend?.trend === 'up' ? 'Rising' : trend?.trend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>

            {/* Last Reading Info */}
            <div className="pt-3 border-t text-xs text-muted-foreground">
              <div>Last reading: {new Date(latestReading.reading_date).toLocaleDateString()}</div>
              {latestReading.notes && (
                <div className="mt-1 italic">"{latestReading.notes}"</div>
              )}
            </div>

            {/* Enhanced AI Insights */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <div className="text-xs font-medium text-blue-800 mb-2 flex items-center gap-1">
                <span>🤖</span> AI Water Analysis
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>📊 Physical depth: {latestReading.water_level}m (measured)</div>
                <div>💧 Current level: {latestReading.percentage_full}% capacity</div>
                <div>📈 Depth correlation: {correlation?.text.toLowerCase()} accuracy</div>
                {latestReading.percentage_full > 70 
                  ? <div>✅ Excellent water security - reservoir well maintained</div>
                  : <div>⚠️ Monitor water levels - consider conservation measures</div>
                }
                {readings.length === 0 && (
                  <div>ℹ️ Add regular readings to enable trend analysis and predictive insights</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddReservoirReadingDialog
        isOpen={isAddingReading}
        onOpenChange={setIsAddingReading}
        onReadingSaved={() => {
          onReadingAdded();
          setIsAddingReading(false);
        }}
      />

      <AddReservoirReadingDialog
        isOpen={isEditingReading}
        onOpenChange={setIsEditingReading}
        onReadingSaved={() => {
          onReadingAdded();
          setIsEditingReading(false);
        }}
        editingReading={latestReading}
      />
    </>
  );
};
