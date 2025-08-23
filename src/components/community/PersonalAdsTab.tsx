
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Search, User, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PersonalAd {
  id: string;
  title: string;
  description: string;
  ad_type: string;
  age_range: string;
  interests: string[];
  contact_preference: string;
  created_at: string;
}

// Mock data until database types are updated
const mockAds: PersonalAd[] = [
  {
    id: '1',
    title: 'Walking Companion Wanted',
    description: 'Retired teacher looking for someone to join me for morning walks around the estate. Great way to start the day and make a new friend!',
    ad_type: 'friendship',
    age_range: '60-75',
    interests: ['Walking', 'Nature', 'Conversation'],
    contact_preference: 'Phone call preferred',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Bridge Partner Needed',
    description: 'Experienced bridge player seeking a regular partner for weekly games. Fun and friendly atmosphere.',
    ad_type: 'hobby',
    age_range: '55+',
    interests: ['Bridge', 'Card Games', 'Socializing'],
    contact_preference: 'Email contact',
    created_at: new Date().toISOString()
  }
];

export const PersonalAdsTab = () => {
  const [ads, setAds] = useState<PersonalAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Use mock data for now
    setTimeout(() => {
      setAds(mockAds);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'friendship': return 'bg-blue-100 text-blue-800';
      case 'hobby': return 'bg-green-100 text-green-800';
      case 'activity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAdType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading personal ads...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Personal Connections
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Personal Ad
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search personal ads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredAds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No personal ads found</p>
              <p className="text-sm">Connect with your neighbors by posting a personal ad!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredAds.map((ad) => (
                <Card key={ad.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{ad.title}</h3>
                        <Badge className={`text-xs ${getAdTypeColor(ad.ad_type)}`}>
                          {formatAdType(ad.ad_type)}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {ad.description}
                      </p>
                      
                      {ad.age_range && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>Age range: {ad.age_range}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {ad.interests.map((interest, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                      
                      {ad.contact_preference && (
                        <div className="flex items-center gap-2 text-sm">
                          <MessageCircle className="h-4 w-4 text-gray-500" />
                          <span>Prefers: {ad.contact_preference}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Posted: {new Date(ad.created_at).toLocaleDateString()}
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
