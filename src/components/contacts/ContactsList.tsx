
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Trash2 } from 'lucide-react';
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

interface ContactsListProps {
  contacts: Contact[];
  onContactsChange: () => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  onContactsChange
}) => {
  const handleDeleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact');
        return;
      }

      toast.success('Contact deleted successfully');
      onContactsChange();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const getFullName = (contact: Contact) => {
    const parts = [contact.name, contact.surname].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Unknown';
  };

  const getAddress = (contact: Contact) => {
    const parts = [contact.street_number, contact.street_name].filter(Boolean);
    return parts.join(' ') || null;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{getFullName(contact)}</h3>
                  {contact.erf_no && (
                    <Badge variant="outline" className="mt-1">
                      Erf {contact.erf_no}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {contact.mobile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a 
                      href={`tel:${contact.mobile}`}
                      className="hover:text-primary cursor-pointer"
                    >
                      {contact.mobile}
                    </a>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="hover:text-primary cursor-pointer"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}

                {getAddress(contact) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{getAddress(contact)}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-muted-foreground">
                  Added {new Date(contact.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
