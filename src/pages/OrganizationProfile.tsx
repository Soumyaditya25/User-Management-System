import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Edit, Save } from 'lucide-react';
import { mockApiService, Organization } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function OrganizationProfile() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    type: 'department' | 'division' | 'team' | 'subsidiary';
    status: 'active' | 'inactive';
  }>({
    name: '',
    description: '',
    type: 'department',
    status: 'active',
  });

  useEffect(() => {
    fetchOrganizations();
  }, [user?.tenantId]);

  const fetchOrganizations = async () => {
    try {
      const data = await mockApiService.getOrganizations(user?.tenantId || 'tenant-1');
      setOrganizations(data);
      if (data.length > 0) {
        setSelectedOrg(data[0]);
        setFormData({
          name: data[0].name,
          description: data[0].description,
          type: data[0].type,
          status: data[0].status,
        });
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load organization data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedOrg) return;
    
    try {
      await mockApiService.updateOrganization(
        user?.tenantId || 'tenant-1',
        selectedOrg.id,
        formData
      );
      setEditing(false);
      fetchOrganizations();
      toast({
        title: 'Success',
        description: 'Organization profile updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update organization:', error);
      toast({
        title: 'Error',
        description: 'Failed to update organization profile.',
        variant: 'destructive',
      });
    }
  };

  const selectOrganization = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      description: org.description,
      type: org.type,
      status: org.status,
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <Building2 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
          <p className="text-gray-600 mt-1">View and manage organization details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Select an organization to view its profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedOrg?.id === org.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => selectOrganization(org)}
                >
                  <div className="font-medium">{org.name}</div>
                  <div className="text-sm opacity-70">{org.type}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {selectedOrg && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedOrg.name}</CardTitle>
                    <CardDescription>Organization details and information</CardDescription>
                  </div>
                  <Button
                    variant={editing ? "default" : "outline"}
                    onClick={() => editing ? handleSave() : setEditing(true)}
                  >
                    {editing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {editing ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      value={formData.type}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!editing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Badge variant={selectedOrg.status === 'active' ? 'default' : 'secondary'}>
                      {selectedOrg.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Created</Label>
                    <div className="text-sm text-gray-600">
                      {new Date(selectedOrg.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
