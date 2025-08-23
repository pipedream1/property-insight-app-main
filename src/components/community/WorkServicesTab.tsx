
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Search, Clock, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WorkService {
  id: string;
  title: string;
  description: string;
  service_type: string;
  hourly_rate: number;
  availability: string;
  skills: string[];
  contact_info: string;
  created_at: string;
}

// Mock data until database types are updated
const mockServices: WorkService[] = [
  {
    id: '1',
    title: 'Garden Maintenance',
    description: 'Professional garden care including pruning, planting, and general maintenance. 20 years experience.',
    service_type: 'service',
    hourly_rate: 35.00,
    availability: 'Weekdays and Saturday mornings',
    skills: ['Pruning', 'Landscaping', 'Plant Care'],
    contact_info: 'Call Peter at 111-222-3333',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Computer Help',
    description: 'Assistance with computers, smartphones, and tablets. Patient and friendly service for seniors.',
    service_type: 'service',
    hourly_rate: 40.00,
    availability: 'Flexible hours',
    skills: ['Computer Repair', 'Tech Support', 'Training'],
    contact_info: 'Email tech.help@example.com',
    created_at: new Date().toISOString()
  }
];

export const WorkServicesTab = () => {
  const [services, setServices] = useState<WorkService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Use mock data for now
    setTimeout(() => {
      setServices(mockServices);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work & Professional Services
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No services found</p>
              <p className="text-sm">Be the first to offer your professional services!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        {service.hourly_rate && (
                          <div className="flex items-center text-green-600 font-bold">
                            <DollarSign className="h-4 w-4" />
                            R{service.hourly_rate}/hr
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {service.service_type}
                        </Badge>
                        {service.skills.map((skill, index) => (
                          <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      {service.availability && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{service.availability}</span>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Contact:</p>
                        <p className="text-sm font-medium">{service.contact_info}</p>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Posted: {new Date(service.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
