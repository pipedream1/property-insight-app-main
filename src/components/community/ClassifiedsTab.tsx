
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AddClassifiedDialog } from './AddClassifiedDialog';

interface Classified {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  condition: string;
  contact_info: string;
  created_at: string;
}

// Mock data until database types are updated
const mockClassifieds: Classified[] = [
  {
    id: '1',
    title: 'Vintage Garden Table',
    description: 'Beautiful teak garden table, perfect for outdoor dining. Well maintained and weather-treated.',
    category: 'furniture',
    price: 450.00,
    condition: 'good',
    contact_info: 'Contact Mary at 123-456-7890',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Exercise Bike',
    description: 'Barely used stationary bike, perfect for home workouts. Adjustable resistance and comfortable seat.',
    category: 'exercise',
    price: 280.00,
    condition: 'like_new',
    contact_info: 'Email john@example.com',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Gardening Tools Set',
    description: 'Complete set of quality gardening tools including spades, rakes, and pruning shears.',
    category: 'garden',
    price: 75.00,
    condition: 'good',
    contact_info: 'WhatsApp 098-765-4321',
    created_at: new Date().toISOString()
  }
];

export const ClassifiedsTab = () => {
  const [classifieds, setClassifieds] = useState<Classified[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Use mock data for now
    setTimeout(() => {
      setClassifieds(mockClassifieds);
      setIsLoading(false);
    }, 500);
  }, []);

  const fetchClassifieds = async () => {
    // Mock refresh - in real implementation this would fetch from Supabase
    setClassifieds([...mockClassifieds]);
  };

  const filteredClassifieds = classifieds.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like_new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCondition = (condition: string) => {
    return condition.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading classifieds...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Community Classifieds
            </CardTitle>
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search classifieds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredClassifieds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No classifieds found</p>
              <p className="text-sm">Be the first to add an item for sale!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClassifieds.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        {item.price && (
                          <div className="text-lg font-bold text-green-600">
                            R{item.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge className={`text-xs ${getConditionColor(item.condition)}`}>
                          {formatCondition(item.condition)}
                        </Badge>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Contact:</p>
                        <p className="text-sm font-medium">{item.contact_info}</p>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Posted: {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddClassifiedDialog
        isOpen={isAddingItem}
        onOpenChange={setIsAddingItem}
        onItemAdded={fetchClassifieds}
      />
    </div>
  );
};
