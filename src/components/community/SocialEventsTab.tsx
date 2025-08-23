
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Search, MapPin, Users, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EventsCalendar } from './EventsCalendar';

interface SocialEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  max_participants: number;
  current_participants: number;
  event_type: string;
  contact_info: string;
  created_at: string;
}

// Mock data until database types are updated
const mockEvents: SocialEvent[] = [
  {
    id: '1',
    title: 'Book Club Meeting',
    description: 'Monthly book club discussion. This month we are reading "The Thursday Murder Club". New members welcome!',
    event_date: '2024-02-15T14:00:00+02:00',
    location: 'Community Center',
    max_participants: 12,
    current_participants: 8,
    event_type: 'social',
    contact_info: 'Contact Linda at book.club@belvidere.com',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Garden Walking Group',
    description: 'Join us for a leisurely walk through the estate gardens. All fitness levels welcome.',
    event_date: '2024-02-18T09:00:00+02:00',
    location: 'Main Gate',
    max_participants: 20,
    current_participants: 15,
    event_type: 'exercise',
    contact_info: 'Meet at main gate or call 444-555-6666',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Wine Tasting Evening',
    description: 'Sample local wines and meet your neighbors. Light snacks provided.',
    event_date: '2024-02-22T18:00:00+02:00',
    location: 'Clubhouse',
    max_participants: 25,
    current_participants: 18,
    event_type: 'social',
    contact_info: 'RSVP to events@belvidere.com',
    created_at: new Date().toISOString()
  }
];

export const SocialEventsTab = () => {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Use mock data for now
    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isEventPast = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Visual Calendar */}
      <EventsCalendar events={events} />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              All Social Events & Activities
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events found</p>
              <p className="text-sm">Be the first to organize a community event!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredEvents.map((event) => {
                const eventDateTime = formatEventDate(event.event_date);
                const isPast = isEventPast(event.event_date);
                
                return (
                  <Card key={event.id} className={`hover:shadow-md transition-shadow ${isPast ? 'opacity-75' : ''}`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          {isPast && (
                            <Badge variant="secondary" className="text-xs">
                              Past Event
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{eventDateTime.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{eventDateTime.time}</span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.max_participants && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span>
                                {event.current_participants}/{event.max_participants} participants
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {event.event_type}
                          </Badge>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Contact:</p>
                          <p className="text-sm font-medium">{event.contact_info}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
