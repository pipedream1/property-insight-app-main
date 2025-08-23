
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, Activity, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Anomaly {
  component: string;
  type: 'spike' | 'drop' | 'malfunction' | 'trend';
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommended_action: string;
}

interface AnomalyData {
  anomalies: Anomaly[];
  overall_status: 'normal' | 'concerning' | 'critical';
  summary: string;
}

export const AnomalyDetection = () => {
  const [anomalyData, setAnomalyData] = useState<AnomalyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runDetection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/functions/v1/anomaly-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAnomalyData(data.analysis);
      setLastChecked(new Date());
      toast.success('Anomaly detection completed');
    } catch (error) {
      console.error('Anomaly detection error:', error);
      toast.error('Failed to run anomaly detection');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDetection();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'concerning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spike': return '📈';
      case 'drop': return '📉';
      case 'malfunction': return '⚠️';
      case 'trend': return '📊';
      default: return '🔍';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center justify-between text-orange-700">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Water Usage Anomaly Detection
            </div>
            <Button 
              onClick={runDetection} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Scanning...' : 'Scan for Anomalies'}
            </Button>
          </CardTitle>
          <p className="text-sm text-orange-600">
            AI-powered detection of unusual water usage patterns and potential issues
          </p>
        </CardHeader>
        
        <CardContent className="pt-6">
          {!anomalyData && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Click "Scan for Anomalies" to analyze water usage</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 animate-pulse mx-auto mb-4 text-orange-600" />
              <p className="text-muted-foreground">Analyzing water usage patterns...</p>
            </div>
          )}

          {anomalyData && (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">System Status</h3>
                <div className={`text-2xl font-bold capitalize ${getStatusColor(anomalyData.overall_status)}`}>
                  {anomalyData.overall_status}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {anomalyData.summary}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {lastChecked && `Last checked: ${lastChecked.toLocaleString()}`}
                </p>
              </div>

              {/* Anomalies */}
              {anomalyData.anomalies.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Detected Anomalies ({anomalyData.anomalies.length})
                  </h3>
                  <div className="space-y-4">
                    {anomalyData.anomalies.map((anomaly, index) => (
                      <Card key={index} className="border-orange-200">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTypeIcon(anomaly.type)}</span>
                              <h4 className="font-medium">{anomaly.component}</h4>
                            </div>
                            <Badge className={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity} severity
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Issue:</p>
                              <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700">Recommended Action:</p>
                              <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                                {anomaly.recommended_action}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-700 mb-2">No Anomalies Detected</h3>
                  <p className="text-muted-foreground">
                    All water usage patterns appear normal. Continue monitoring for any changes.
                  </p>
                </div>
              )}

              {/* Detection Tips */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Detection Capabilities</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Sudden spikes in water consumption (potential leaks)</li>
                  <li>• Unexpected drops in usage (meter malfunctions)</li>
                  <li>• Unusual consumption trends over time</li>
                  <li>• Component-specific usage anomalies</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
