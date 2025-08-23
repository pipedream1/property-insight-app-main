
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';

interface SocialEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  max_participants: number;
  current_participants: number;
  event_type: string;
}

interface EventsCalendarProps {
  events: SocialEvent[];
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({ events }) => {
  // Get next 7 days
  const today = new Date();
  const nextWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatDate = (date: Date, isToday: boolean = false) => {
    if (isToday) return 'Today';
    const day = date.toLocaleDateString('en', { weekday: 'short' });
    const dayNum = date.getDate();
    return `${day} ${dayNum}`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
          Upcoming Events - Next 7 Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {nextWeek.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isToday = index === 0;
            
            return (
              <div 
                key={date.toISOString()} 
                className={`p-3 rounded-lg border-2 min-h-[120px] ${
                  isToday 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                } transition-colors`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {formatDate(date, isToday)}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.length === 0 ? (
                    <div className="text-xs text-gray-400 italic">No events</div>
                  ) : (
                    dayEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="bg-white p-2 rounded border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                          {event.title}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Users className="h-3 w-3" />
                            <span>{event.current_participants}/{event.max_participants}</span>
                          </div>
                          
                          <Badge 
                            variant="outline" 
                            className="text-xs h-4 px-1"
                          >
                            {event.event_type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Click on any event for more details • Scroll down to see all upcoming events
        </div>
      </CardContent>
    </Card>
  );
};
