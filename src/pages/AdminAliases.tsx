import React, { useEffect, useState } from 'react';
import { fetchWaterSources, fetchWaterSourceAliases, addAlias, deleteAlias, WaterSource, WaterSourceAlias } from '@/api/waterSourcesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminAliases: React.FC = () => {
  const { toast } = useToast();
  const [sources, setSources] = useState<WaterSource[]>([]);
  const [aliases, setAliases] = useState<WaterSourceAlias[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<number | ''>('');
  const [newAlias, setNewAlias] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [s, a] = await Promise.all([
        fetchWaterSources(),
        fetchWaterSourceAliases(),
      ]);
      setSources(s);
      setAliases(a);
    } catch (e: any) {
      toast({ title: 'Failed to load aliases', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onAdd = async () => {
    if (!selectedSourceId || !newAlias.trim()) return;
    setSaving(true);
    try {
      await addAlias(Number(selectedSourceId), newAlias.trim());
      setNewAlias('');
      await load();
      toast({ title: 'Alias added' });
    } catch (e: any) {
      toast({ title: 'Failed to add alias', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteAlias(id);
      await load();
      toast({ title: 'Alias removed' });
    } catch (e: any) {
      toast({ title: 'Failed to remove alias', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <ProtectedRoute requiredRoles={['owner','management']}>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Water Source Aliases</h1>

        <Card>
          <CardHeader>
            <CardTitle>Add Alias</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Source</Label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">Select source…</option>
                {sources.map(s => (
                  <option key={s.id} value={s.id}>{s.canonical_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Alias</Label>
              <Input value={newAlias} onChange={(e) => setNewAlias(e.target.value)} placeholder="e.g. municipal" />
            </div>
            <div className="flex items-end">
              <Button onClick={onAdd} disabled={saving || !selectedSourceId || !newAlias.trim()}>Add</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Aliases</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading…</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Source</th>
                      <th className="p-2">Alias</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aliases.map(a => {
                      const src = sources.find(s => s.id === a.water_source_id);
                      return (
                        <tr key={a.id} className="border-t">
                          <td className="p-2">{src?.canonical_name ?? a.water_source_id}</td>
                          <td className="p-2">{a.alias}</td>
                          <td className="p-2">
                            <Button variant="destructive" size="sm" onClick={() => onDelete(a.id)}>Delete</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AdminAliases;
