import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Key, 
  Plus, 
  Edit, 
  Calendar,
  Tag
} from 'lucide-react';
import { mockApiService, Privilege } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Privileges() {
  const { user } = useAuth();
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isSystemPrivilege: false,
  });

  useEffect(() => {
    fetchPrivileges();
  }, [user?.tenantId]);

  const fetchPrivileges = async () => {
    try {
      const data = await mockApiService.getPrivileges(user?.tenantId || 'tenant-1');
      setPrivileges(data);
    } catch (error) {
      console.error('Failed to fetch privileges:', error);
      toast({
        title: 'Error',
        description: 'Failed to load privileges data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(privileges.map(p => p.category)));

  const filteredPrivileges = privileges.filter(privilege => {
    const matchesSearch = privilege.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      privilege.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      privilege.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || privilege.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, string> = {
      'User Management': 'bg-blue-100 text-blue-800',
      'Reporting': 'bg-green-100 text-green-800',
      'Project Management': 'bg-purple-100 text-purple-800',
      'System Administration': 'bg-red-100 text-red-800',
      'Marketing': 'bg-orange-100 text-orange-800',
    };
    const variant = variants[category] || 'bg-gray-100 text-gray-800';
    return <Badge className={variant}>{category}</Badge>;
  };

  const handleCreatePrivilege = async () => {
    try {
      const newPrivilege = await mockApiService.createPrivilege(user?.tenantId || 'tenant-1', formData);
      setPrivileges([...privileges, newPrivilege]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Privilege created successfully.',
      });
    } catch (error) {
      console.error('Failed to create privilege:', error);
      toast({
        title: 'Error',
        description: 'Failed to create privilege.',
        variant: 'destructive',
      });
    }
  };

  const handleEditPrivilege = async () => {
    if (!selectedPrivilege) return;
    
    try {
      const updatedPrivilege = await mockApiService.updatePrivilege(
        user?.tenantId || 'tenant-1',
        selectedPrivilege.id,
        formData
      );
      setPrivileges(privileges.map(priv => priv.id === selectedPrivilege.id ? updatedPrivilege : priv));
      setIsEditDialogOpen(false);
      setSelectedPrivilege(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'Privilege updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update privilege:', error);
      toast({
        title: 'Error',
        description: 'Failed to update privilege.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (privilege: Privilege) => {
    setSelectedPrivilege(privilege);
    setFormData({
      name: privilege.name,
      description: privilege.description,
      category: privilege.category,
      isSystemPrivilege: privilege.isSystemPrivilege,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      isSystemPrivilege: false,
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Privilege Management</h1>
          <p className="text-gray-600 mt-1">Manage system privileges and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Privilege
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Privilege</DialogTitle>
              <DialogDescription>
                Create a new privilege that can be assigned to roles.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Privilege Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Manage Projects"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this privilege allows"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Project Management"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePrivilege}>Create Privilege</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Privileges ({filteredPrivileges.length})</CardTitle>
              <CardDescription>
                Manage system privileges and their categories
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search privileges..."
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
                  <TableHead>Privilege</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrivileges.map((privilege) => (
                  <TableRow key={privilege.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-medium">
                          <Key className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{privilege.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {privilege.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-gray-400" />
                        {getCategoryBadge(privilege.category)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={privilege.isSystemPrivilege ? "default" : "secondary"}>
                        {privilege.isSystemPrivilege ? 'System' : 'Custom'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(privilege.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(privilege)}
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

      {/* Edit Privilege Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Privilege</DialogTitle>
            <DialogDescription>
              Update privilege information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Privilege Name</Label>
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
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPrivilege}>Update Privilege</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
