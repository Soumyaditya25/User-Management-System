import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, 
  Shield, 
  Plus, 
  Edit, 
  Key,
  Calendar,
  Users
} from 'lucide-react';
import { mockApiService, Role, Privilege } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Roles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    privileges: [] as string[],
    isSystemRole: false,
  });

  useEffect(() => {
    fetchData();
  }, [user?.tenantId]);

  const fetchData = async () => {
    try {
      const [rolesData, privilegesData] = await Promise.all([
        mockApiService.getRoles(user?.tenantId || 'tenant-1'),
        mockApiService.getPrivileges(user?.tenantId || 'tenant-1'),
      ]);
      setRoles(rolesData);
      setPrivileges(privilegesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load roles data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPrivilegeName = (privilegeId: string) => {
    const privilege = privileges.find(p => p.id === privilegeId);
    return privilege?.name || 'Unknown Privilege';
  };

  const handleCreateRole = async () => {
    try {
      const newRole = await mockApiService.createRole(user?.tenantId || 'tenant-1', formData);
      setRoles([...roles, newRole]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Role created successfully.',
      });
    } catch (error) {
      console.error('Failed to create role:', error);
      toast({
        title: 'Error',
        description: 'Failed to create role.',
        variant: 'destructive',
      });
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;
    
    try {
      const updatedRole = await mockApiService.updateRole(
        user?.tenantId || 'tenant-1',
        selectedRole.id,
        formData
      );
      setRoles(roles.map(role => role.id === selectedRole.id ? updatedRole : role));
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'Role updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      privileges: role.privileges,
      isSystemRole: role.isSystemRole,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      privileges: [],
      isSystemRole: false,
    });
  };

  const handlePrivilegeChange = (privilegeId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, privileges: [...formData.privileges, privilegeId] });
    } else {
      setFormData({ ...formData, privileges: formData.privileges.filter(p => p !== privilegeId) });
    }
  };

  const privilegesByCategory = privileges.reduce((acc, privilege) => {
    if (!acc[privilege.category]) {
      acc[privilege.category] = [];
    }
    acc[privilege.category].push(privilege);
    return acc;
  }, {} as Record<string, Privilege[]>);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">Manage user roles and their associated privileges</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a new role with specific privileges and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Engineering Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the role's responsibilities"
                />
              </div>
              <div className="space-y-4">
                <Label>Privileges</Label>
                <div className="space-y-4 max-h-64 overflow-y-auto border rounded-md p-4">
                  {Object.entries(privilegesByCategory).map(([category, categoryPrivileges]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">{category}</h4>
                      <div className="space-y-2 ml-4">
                        {categoryPrivileges.map((privilege) => (
                          <div key={privilege.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={privilege.id}
                              checked={formData.privileges.includes(privilege.id)}
                              onCheckedChange={(checked) => handlePrivilegeChange(privilege.id, checked as boolean)}
                            />
                            <Label htmlFor={privilege.id} className="text-sm">
                              {privilege.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>Create Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Roles ({filteredRoles.length})</CardTitle>
              <CardDescription>
                Manage user roles and their privilege assignments
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Privileges</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-medium">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{role.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {role.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.privileges.slice(0, 3).map((privilegeId) => (
                          <Badge key={privilegeId} variant="outline" className="text-xs">
                            <Key className="w-3 h-3 mr-1" />
                            {getPrivilegeName(privilegeId)}
                          </Badge>
                        ))}
                        {role.privileges.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.privileges.length - 3} more
                          </Badge>
                        )}
                        {role.privileges.length === 0 && (
                          <span className="text-sm text-gray-500">No privileges assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.isSystemRole ? "default" : "secondary"}>
                        {role.isSystemRole ? 'System Role' : 'Custom Role'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(role.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and privilege assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Role Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-4">
              <Label>Privileges</Label>
              <div className="space-y-4 max-h-64 overflow-y-auto border rounded-md p-4">
                {Object.entries(privilegesByCategory).map(([category, categoryPrivileges]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">{category}</h4>
                    <div className="space-y-2 ml-4">
                      {categoryPrivileges.map((privilege) => (
                        <div key={privilege.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${privilege.id}`}
                            checked={formData.privileges.includes(privilege.id)}
                            onCheckedChange={(checked) => handlePrivilegeChange(privilege.id, checked as boolean)}
                          />
                          <Label htmlFor={`edit-${privilege.id}`} className="text-sm">
                            {privilege.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>Update Role</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
