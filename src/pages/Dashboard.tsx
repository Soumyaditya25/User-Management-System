import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  Shield, 
  Activity, 
  TrendingUp,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { mockApiService, Tenant, User, Role, Organization } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  totalRoles: number;
  recentActivity: {
    action: string;
    user: string;
    timestamp: string;
    type: 'create' | 'update' | 'delete' | 'login';
  }[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [users, organizations, roles] = await Promise.all([
          mockApiService.getUsers(user?.tenantId || 'tenant-1'),
          mockApiService.getOrganizations(user?.tenantId || 'tenant-1'),
          mockApiService.getRoles(user?.tenantId || 'tenant-1'),
        ]);

        const activeUsers = users.filter(u => u.status === 'active').length;

        // Mock recent activity data
        const recentActivity = [
          {
            action: 'New user created: jane.doe@acme.com',
            user: 'System Administrator',
            timestamp: '2 minutes ago',
            type: 'create' as const,
          },
          {
            action: 'User role updated for john.smith@acme.com',
            user: 'HR Manager',
            timestamp: '15 minutes ago',
            type: 'update' as const,
          },
          {
            action: 'Organization "Marketing Team" created',
            user: 'System Administrator',
            timestamp: '1 hour ago',
            type: 'create' as const,
          },
          {
            action: 'User sarah.wilson@acme.com logged in',
            user: 'Sarah Wilson',
            timestamp: '2 hours ago',
            type: 'login' as const,
          },
          {
            action: 'Role "Content Manager" permissions updated',
            user: 'Security Admin',
            timestamp: '3 hours ago',
            type: 'update' as const,
          },
        ];

        setStats({
          totalUsers: users.length,
          activeUsers,
          totalOrganizations: organizations.length,
          totalRoles: roles.length,
          recentActivity,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.tenantId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <UserPlus className="w-4 h-4 text-green-600" />;
      case 'update':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'delete':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'login':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-user':
        navigate('/users');
        setTimeout(() => {
          const addButton = document.querySelector('[data-action="add-user"]') as HTMLButtonElement;
          if (addButton) {
            addButton.click();
          }
        }, 100);
        break;
      case 'add-organization':
        navigate('/organizations');
        break;
      case 'create-role':
        navigate('/roles');
        break;
      case 'view-audit-logs':
        navigate('/audit-logs');
        break;
      default:
        toast({
          title: 'Feature',
          description: `${action} feature activated`,
        });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.firstName}! Here's what's happening in your organization.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => handleQuickAction('create-user')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats?.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{stats?.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                {stats?.activeUsers}/{stats?.totalUsers} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Organizations</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats?.totalOrganizations}</p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+3</span>
              <span className="text-muted-foreground ml-1">this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">Total Roles</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats?.totalRoles}</p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <Badge variant="outline" className="border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300">
                Custom Roles
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions and changes in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span>by {activity.user}</span>
                      <span className="mx-1">•</span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('create-user')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create New User
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('add-organization')}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Add Organization
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('create-role')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Create Role
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleQuickAction('view-audit-logs')}
              >
                <Activity className="w-4 h-4 mr-2" />
                View Audit Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Authentication Service</p>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-foreground">User Management API</p>
                <p className="text-xs text-muted-foreground">Response time: 45ms</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Notification Service</p>
                <p className="text-xs text-muted-foreground">Minor delays detected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}