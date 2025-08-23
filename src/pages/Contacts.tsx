
import React, { useState, useEffect } from 'react';
import TopNavigation from '@/components/TopNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoIcon, Upload, Users } from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import { ContactImportDialog } from '@/components/contacts/ContactImportDialog';
import { ContactsList } from '@/components/contacts/ContactsList';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Contact {
  id: string;
  surname: string | null;
  name: string | null;
  erf_no: string | null;
  street_name: string | null;
  street_number: string | null;
  mobile: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('surname', { ascending: true });

      if (error) {
        console.error('Error fetching contacts:', error);
        toast.error('Failed to fetch contacts');
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleImportSuccess = () => {
    fetchContacts();
    toast.success('Contacts imported successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        <BackButton />
        
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-2xl font-bold">Contacts</h1>
        </div>
        <p className="text-muted-foreground text-center mb-6">
          Manage and organize contacts related to your property.
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <ContactImportDialog onImportSuccess={handleImportSuccess} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Your Contacts ({contacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">Loading contacts...</div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mb-2 text-lg font-semibold">No Contacts Yet</h3>
                <p className="mb-4 text-muted-foreground max-w-md">
                  Start by importing contacts from a CSV file to build your contact database.
                </p>
              </div>
            ) : (
              <ContactsList contacts={contacts} onContactsChange={fetchContacts} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Contacts;
