
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, BarChart3, FileText, Wrench } from 'lucide-react';

interface QuerySuggestion {
  id: string;
  text: string;
  category: 'water' | 'maintenance' | 'reports' | 'components';
  example: string;
}

export const NaturalLanguageQuery = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const suggestions: QuerySuggestion[] = [
    {
      id: 'water-usage',
      text: 'How much water did we use last month?',
      category: 'water',
      example: 'Total usage: 45,230L across all sources'
    },
    {
      id: 'maintenance-schedule',
      text: 'Which components need inspection this week?',
      category: 'maintenance',
      example: 'Tennis court, Pool pump, Gate motor'
    },
    {
      id: 'component-status',
      text: 'Show me all components in poor condition',
      category: 'components',
      example: '3 components: Gate motor, Tennis lighting, Pool filter'
    },
    {
      id: 'report-summary',
      text: 'Summarize this month\'s component report',
      category: 'reports',
      example: 'Overall good condition, 2 items need attention'
    }
  ];

  const handleQuery = async (queryText: string) => {
    setIsProcessing(true);
    setQuery(queryText);
    
    // Simulate AI processing
    setTimeout(() => {
      const suggestion = suggestions.find(s => s.text === queryText);
      setResult(suggestion ? suggestion.example : `Processing query: "${queryText}"...`);
      setIsProcessing(false);
    }, 1500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water': return <BarChart3 className="h-3 w-3" />;
      case 'maintenance': return <Wrench className="h-3 w-3" />;
      case 'reports': return <FileText className="h-3 w-3" />;
      case 'components': return <Search className="h-3 w-3" />;
      default: return <Sparkles className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'water': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reports': return 'bg-green-100 text-green-800 border-green-200';
      case 'components': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Natural Language Queries
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about your property data in plain English
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask anything about your property data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery(query)}
            className="flex-1"
          />
          <Button 
            onClick={() => handleQuery(query)}
            disabled={!query.trim() || isProcessing}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {result && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">AI Response</span>
            </div>
            <p className="text-sm text-blue-700">{result}</p>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
            <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            <span className="text-sm text-gray-600">Processing your query...</span>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Try these examples:</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleQuery(suggestion.text)}
                className="w-full text-left p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{suggestion.text}</span>
                  <Badge className={getCategoryColor(suggestion.category)} variant="outline">
                    {getCategoryIcon(suggestion.category)}
                    {suggestion.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.example}</p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
