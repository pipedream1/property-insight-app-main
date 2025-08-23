
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, FileText, DropletIcon, Building, AlertTriangle, Calendar } from 'lucide-react';

export const QuickActions = () => {
  const quickActions = [
    {
      title: 'Ask AI Assistant',
      icon: <MessageCircle className="h-4 w-4" />,
      prompt: 'Hello! I need help with my property management. What can you assist me with today?',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      priority: true
    },
    {
      title: 'Generate Water Report',
      icon: <DropletIcon className="h-4 w-4" />,
      prompt: 'I want to generate a water usage report for the current month. Can you help me with this?',
      color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100'
    },
    {
      title: 'Component Status Check',
      icon: <Building className="h-4 w-4" />,
      prompt: 'Please help me check the status of all property components and identify any that need attention.',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Maintenance Planning',
      icon: <AlertTriangle className="h-4 w-4" />,
      prompt: 'What maintenance tasks should I prioritize this month based on my property data?',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    },
    {
      title: 'Monthly Summary',
      icon: <FileText className="h-4 w-4" />,
      prompt: 'Can you provide me with a comprehensive summary of this month\'s property performance?',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'Schedule Reminder',
      icon: <Calendar className="h-4 w-4" />,
      prompt: 'Help me set up reminders for upcoming maintenance tasks and inspections.',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    }
  ];

  const handleQuickAction = (prompt: string) => {
    const event = new CustomEvent('triggerChatbot', { detail: { message: prompt } });
    window.dispatchEvent(event);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Get instant help with common property management tasks
        </p>
        
        <div className="grid gap-3 md:grid-cols-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 justify-start ${action.color} ${action.priority ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => handleQuickAction(action.prompt)}
            >
              <div className="flex items-center gap-3">
                {action.icon}
                <span className="font-medium">{action.title}</span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Try the quick input above or click "Ask AI Assistant" to start a conversation!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
