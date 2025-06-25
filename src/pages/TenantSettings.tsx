import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, Building2, Users, Shield } from 'lucide-react';
import { mockApiService, Tenant } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function TenantSettings() {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    maxUsers: 500,
    features: ['sso', 'audit_logs', 'custom_roles'],
    customBranding: true,
    description: '',
    domain: '',
  });

  useEffect(() => {
    fetchTenantSettings();
  }, [user?.tenantId]);

  const fetchTenantSettings = async () => {
    try {
      const tenantData = await mockApiService.getTenant(user?.tenantId || 'tenant-1');
      if (tenantData) {
        setTenant(tenantData);
        setSettings({
          maxUsers: tenantData.settings.maxUsers,
          features: tenantData.settings.features,
          customBranding: tenantData.settings.customBranding,
          description: tenantData.description,
          domain: tenantData.domain,
        });
      }
    } catch (error) {
      console.error('Failed to fetch tenant settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tenant settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      if (tenant) {
        await mockApiService.updateTenant(tenant.id, {
          description: settings.description,
          domain: settings.domain,
          settings: {
            maxUsers: settings.maxUsers,
            features: settings.features,
            customBranding: settings.customBranding,
          },
        });
        toast({
          title: 'Success',
          description: 'Tenant settings updated successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tenant settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = (feature: string) => {
    setSettings(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
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
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Settings</h1>
          <p className="text-gray-600 mt-1">Configure your tenant preferences and features</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your tenant's basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={settings.domain}
                  onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
                  placeholder="company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Maximum Users</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={settings.maxUsers}
                  onChange={(e) => setSettings({ ...settings, maxUsers: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="Brief description of your organization"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features & Capabilities</CardTitle>
            <CardDescription>Enable or disable tenant features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-base font-medium">Custom Branding</div>
                <div className="text-sm text-muted-foreground">
                  Allow custom logos and color schemes
                </div>
              </div>
              <Switch
                checked={settings.customBranding}
                onCheckedChange={(checked) => setSettings({ ...settings, customBranding: checked })}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Available Features</Label>
              <div className="flex flex-wrap gap-2">
                {['sso', 'audit_logs', 'custom_roles', 'api_access', 'advanced_reporting'].map((feature) => (
                  <Badge
                    key={feature}
                    variant={settings.features.includes(feature) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
