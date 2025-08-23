
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopNavigation from '@/components/TopNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Heart, Calendar, MessageCircle, FileText, Send } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import { ClassifiedsTab } from '@/components/community/ClassifiedsTab';
import { WorkServicesTab } from '@/components/community/WorkServicesTab';
import { SocialEventsTab } from '@/components/community/SocialEventsTab';
import { PersonalAdsTab } from '@/components/community/PersonalAdsTab';
import { OfficialDocumentsTab } from '@/components/community/OfficialDocumentsTab';

const Community = () => {
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickQuery = () => {
    if (quickQuery.trim()) {
      const event = new CustomEvent('triggerChatbot', { detail: { message: quickQuery } });
      window.dispatchEvent(event);
      setQuickQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuickQuery();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="flex justify-center items-center mb-4">
          <Users className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold">Belvidere Estate Community</h1>
        </div>
        
        <p className="text-muted-foreground text-center mb-6">
          Connect with your neighbors, share resources, and build our community together.
        </p>

        <Tabs defaultValue="classifieds" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 gap-1 h-auto p-1">
            <TabsTrigger value="classifieds" className="flex flex-col items-center gap-1 p-2 text-xs h-auto min-h-[60px]">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Classifieds</span>
              <span className="sm:hidden">Ads</span>
            </TabsTrigger>
            <TabsTrigger value="work" className="flex flex-col items-center gap-1 p-2 text-xs h-auto min-h-[60px]">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Work & Services</span>
              <span className="sm:hidden">Work</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex flex-col items-center gap-1 p-2 text-xs h-auto min-h-[60px]">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Social Events</span>
              <span className="sm:hidden">Events</span>
            </TabsTrigger>
            <TabsTrigger value="personals" className="flex flex-col items-center gap-1 p-2 text-xs h-auto min-h-[60px]">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Personal Ads</span>
              <span className="sm:hidden">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex flex-col items-center gap-1 p-2 text-xs h-auto min-h-[60px]">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Official Documents</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classifieds">
            <ClassifiedsTab />
          </TabsContent>

          <TabsContent value="work">
            <WorkServicesTab />
          </TabsContent>

          <TabsContent value="social">
            <SocialEventsTab />
          </TabsContent>

          <TabsContent value="personals">
            <PersonalAdsTab />
          </TabsContent>

          <TabsContent value="documents">
            <OfficialDocumentsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Community;
