import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Users, Shield, Plus, Minus } from 'lucide-react';
import { mockApiService, User, Role } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function UserRoles() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [user?.tenantId]);

  const fetchData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        mockApiService.getUsers(user?.tenantId || 'tenant-1'),
        mockApiService.getRoles(user?.tenantId || 'tenant-1'),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user roles data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || 'Unknown Role';
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await mockApiService.assignRoleToUser(user?.tenantId || 'tenant-1', userId, roleId);
      fetchData();
      toast({
        title: 'Success',
        description: 'Role assigned successfully.',
      });
    } catch (error) {
      console.error('Failed to assign role:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign role.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      await mockApiService.removeRoleFromUser(user?.tenantId || 'tenant-1', userId, roleId);
      fetchData();
      toast({
        title: 'Success',
        description: 'Role removed successfully.',
      });
    } catch (error) {
      console.error('Failed to remove role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove role.',
        variant: 'destructive',
      });
    }
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
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Roles</h1>
          <p className="text-gray-600 mt-1">Manage user role assignments</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>User Role Assignments ({filteredUsers.length})</CardTitle>
              <CardDescription>
                View and manage role assignments for all users
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Roles</TableHead>
                  <TableHead>Available Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userData) => (
                  <TableRow key={userData.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {userData.firstName} {userData.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {userData.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userData.roles.map((roleId) => (
                          <Badge key={roleId} variant="default" className="text-xs">
                            {getRoleName(roleId)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 h-4 w-4 p-0 hover:bg-red-500 hover:text-white"
                              onClick={() => handleRemoveRole(userData.id, roleId)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {roles
                          .filter(role => !userData.roles.includes(role.id))
                          .map((role) => (
                            <Badge key={role.id} variant="outline" className="text-xs">
                              {role.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-4 w-4 p-0 hover:bg-green-500 hover:text-white"
                                onClick={() => handleAssignRole(userData.id, role.id)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={userData.status === 'active' ? 'default' : 'secondary'}>
                        {userData.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
