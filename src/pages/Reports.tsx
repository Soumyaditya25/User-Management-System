import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Shield, 
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { mockApiService, User, Role, Organization } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const chartConfig = {
  users: {
    label: "Users",
    color: "#0ea5e9",
  },
  active: {
    label: "Active",
    color: "#10b981",
  },
  inactive: {
    label: "Inactive",
    color: "#ef4444",
  },
  pending: {
    label: "Pending",
    color: "#f59e0b",
  },
};

export default function Reports() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');

  useEffect(() => {
    fetchData();
  }, [user?.tenantId]);

  const fetchData = async () => {
    try {
      const [usersData, rolesData, orgsData] = await Promise.all([
        mockApiService.getUsers(user?.tenantId || 'tenant-1'),
        mockApiService.getRoles(user?.tenantId || 'tenant-1'),
        mockApiService.getOrganizations(user?.tenantId || 'tenant-1'),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setOrganizations(orgsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userStatusData = [
    { name: 'Active', value: users.filter(u => u.status === 'active').length, color: COLORS[1] },
    { name: 'Inactive', value: users.filter(u => u.status === 'inactive').length, color: COLORS[3] },
    { name: 'Pending', value: users.filter(u => u.status === 'pending').length, color: COLORS[2] },
    { name: 'Suspended', value: users.filter(u => u.status === 'suspended').length, color: COLORS[4] },
  ].filter(item => item.value > 0);

  const organizationData = organizations.map(org => ({
    name: org.name.length > 10 ? org.name.substring(0, 10) + '...' : org.name,
    users: users.filter(u => u.organizationId === org.id).length,
    type: org.type,
  }));

  const roleDistribution = roles.map(role => ({
    name: role.name,
    users: users.filter(u => u.roles.includes(role.id)).length,
  }));

  // Generate trend data for the last 30 days
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString(),
      activeUsers: Math.floor(Math.random() * 50) + users.filter(u => u.status === 'active').length - 25,
      newUsers: Math.floor(Math.random() * 10),
      totalUsers: users.length + Math.floor(Math.random() * 20) - 10,
    };
  });

  const exportData = (type: 'csv' | 'json') => {
    const data = {
      users: users.length,
      organizations: organizations.length,
      roles: roles.length,
      userStatus: userStatusData,
      organizationDistribution: organizationData,
      roleDistribution: roleDistribution,
      generatedAt: new Date().toISOString(),
    };

    if (type === 'csv') {
      const csv = Object.entries(data).map(([key, value]) => 
        `${key},${typeof value === 'object' ? JSON.stringify(value) : value}`
      ).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Insights and analytics for your tenant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" onClick={() => exportData('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          
          <Button variant="outline" onClick={() => exportData('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+2</span> new roles this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {users.length > 0 ? Math.round((users.filter(u => u.status === 'active').length / users.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">User activation rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">User Growth Trends</CardTitle>
              <CardDescription>User activity over time</CardDescription>
            </div>
            <Select value={chartType} onValueChange={(value: 'bar' | 'line' | 'area') => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="activeUsers" fill="var(--color-active)" name="Active Users" />
                  <Bar dataKey="newUsers" fill="var(--color-users)" name="New Users" />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="activeUsers" stroke="var(--color-active)" name="Active Users" />
                  <Line type="monotone" dataKey="totalUsers" stroke="var(--color-users)" name="Total Users" />
                </LineChart>
              ) : (
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area type="monotone" dataKey="totalUsers" stackId="1" stroke="var(--color-users)" fill="var(--color-users)" name="Total Users" />
                  <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="var(--color-active)" fill="var(--color-active)" name="Active Users" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">User Distribution by Organization</CardTitle>
            <CardDescription>Number of users in each organization</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={organizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="users" fill="var(--color-users)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">User Status Distribution</CardTitle>
            <CardDescription>Current status of all users</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Role Distribution</CardTitle>
          <CardDescription>Number of users assigned to each role</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="users" fill="var(--color-users)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
