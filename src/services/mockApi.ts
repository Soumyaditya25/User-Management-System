// Mock API service layer for the User Management System

export interface Tenant {
  id: string;
  name: string;
  description: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  settings: {
    maxUsers: number;
    features: string[];
    customBranding: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  parentId?: string;
  type: 'department' | 'division' | 'team' | 'subsidiary';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  organizationId?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  roles: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  tenantId: string;
  privileges: string[];
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Privilege {
  id: string;
  name: string;
  description: string;
  category: string;
  tenantId: string;
  isSystemPrivilege: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalEntity {
  id: string;
  name: string;
  type: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship';
  registrationNumber: string;
  tenantId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'active' | 'inactive' | 'dissolved';
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Acme Corporation',
    description: 'Leading technology solutions provider',
    domain: 'acme.com',
    status: 'active',
    settings: {
      maxUsers: 500,
      features: ['sso', 'audit_logs', 'custom_roles'],
      customBranding: true,
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'tenant-2',
    name: 'Global Enterprises',
    description: 'International business solutions',
    domain: 'global-ent.com',
    status: 'active',
    settings: {
      maxUsers: 1000,
      features: ['sso', 'audit_logs', 'custom_roles', 'api_access'],
      customBranding: true,
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
  },
];

const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Engineering',
    description: 'Software development and engineering teams',
    tenantId: 'tenant-1',
    type: 'department',
    status: 'active',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'org-2',
    name: 'Frontend Team',
    description: 'User interface and experience development',
    tenantId: 'tenant-1',
    parentId: 'org-1',
    type: 'team',
    status: 'active',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'org-3',
    name: 'Marketing',
    description: 'Marketing and communications department',
    tenantId: 'tenant-1',
    type: 'department',
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z',
  },
];

const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'john.doe',
    email: 'john.doe@acme.com',
    firstName: 'John',
    lastName: 'Doe',
    tenantId: 'tenant-1',
    organizationId: 'org-2',
    status: 'active',
    roles: ['role-2'],
    lastLogin: '2024-06-24T10:30:00Z',
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z',
  },
  {
    id: 'user-2',
    username: 'jane.smith',
    email: 'jane.smith@acme.com',
    firstName: 'Jane',
    lastName: 'Smith',
    tenantId: 'tenant-1',
    organizationId: 'org-1',
    status: 'active',
    roles: ['role-1'],
    lastLogin: '2024-06-24T14:15:00Z',
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-06-22T00:00:00Z',
  },
  {
    id: 'user-3',
    username: 'mike.wilson',
    email: 'mike.wilson@acme.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    tenantId: 'tenant-1',
    organizationId: 'org-3',
    status: 'active',
    roles: ['role-3'],
    lastLogin: '2024-06-23T16:45:00Z',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-06-18T00:00:00Z',
  },
];

const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Engineering Manager',
    description: 'Lead engineering teams and projects',
    tenantId: 'tenant-1',
    privileges: ['priv-1', 'priv-2', 'priv-3', 'priv-4'],
    isSystemRole: false,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'role-2',
    name: 'Frontend Developer',
    description: 'Develop user interfaces and experiences',
    tenantId: 'tenant-1',
    privileges: ['priv-2', 'priv-3'],
    isSystemRole: false,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
  },
  {
    id: 'role-3',
    name: 'Marketing Specialist',
    description: 'Create and execute marketing campaigns',
    tenantId: 'tenant-1',
    privileges: ['priv-5', 'priv-6'],
    isSystemRole: false,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z',
  },
];

const mockPrivileges: Privilege[] = [
  {
    id: 'priv-1',
    name: 'Manage Users',
    description: 'Create, update, and delete user accounts',
    category: 'User Management',
    tenantId: 'tenant-1',
    isSystemPrivilege: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'priv-2',
    name: 'View Reports',
    description: 'Access system reports and analytics',
    category: 'Reporting',
    tenantId: 'tenant-1',
    isSystemPrivilege: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'priv-3',
    name: 'Manage Projects',
    description: 'Create and manage development projects',
    category: 'Project Management',
    tenantId: 'tenant-1',
    isSystemPrivilege: false,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-04-10T00:00:00Z',
  },
  {
    id: 'priv-4',
    name: 'System Configuration',
    description: 'Configure system settings and preferences',
    category: 'System Administration',
    tenantId: 'tenant-1',
    isSystemPrivilege: false,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-04-10T00:00:00Z',
  },
  {
    id: 'priv-5',
    name: 'Manage Campaigns',
    description: 'Create and manage marketing campaigns',
    category: 'Marketing',
    tenantId: 'tenant-1',
    isSystemPrivilege: false,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'priv-6',
    name: 'Analytics Access',
    description: 'Access marketing analytics and metrics',
    category: 'Marketing',
    tenantId: 'tenant-1',
    isSystemPrivilege: false,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
];

const mockLegalEntities: LegalEntity[] = [
  {
    id: 'legal-1',
    name: 'Acme Corporation Inc.',
    type: 'corporation',
    registrationNumber: 'CORP-2024-001',
    tenantId: 'tenant-1',
    address: {
      street: '123 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
    },
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'legal-2',
    name: 'Acme Subsidiary LLC',
    type: 'llc',
    registrationNumber: 'LLC-2024-002',
    tenantId: 'tenant-1',
    address: {
      street: '456 Tech Street',
      city: 'Palo Alto',
      state: 'CA',
      zipCode: '94301',
      country: 'United States',
    },
    status: 'active',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-05-15T00:00:00Z',
  },
];

// Utility function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API service functions
export const mockApiService = {
  // Authentication
  async login(username: string, password: string) {
    await delay(800);
    if (username === 'admin@system.com' && password === 'admin123') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          username: 'admin@system.com',
          email: 'admin@system.com',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'System Admin',
          tenantId: 'tenant-1',
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  // Tenants
  async getTenants(): Promise<Tenant[]> {
    await delay(500);
    return [...mockTenants];
  },

  async getTenant(id: string): Promise<Tenant | null> {
    await delay(300);
    return mockTenants.find(t => t.id === id) || null;
  },

  async createTenant(data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant> {
    await delay(800);
    const newTenant: Tenant = {
      ...data,
      id: 'tenant-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTenants.push(newTenant);
    return newTenant;
  },

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
    await delay(600);
    const index = mockTenants.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tenant not found');
    
    mockTenants[index] = {
      ...mockTenants[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockTenants[index];
  },

  // Organizations
  async getOrganizations(tenantId: string): Promise<Organization[]> {
    await delay(500);
    return mockOrganizations.filter(org => org.tenantId === tenantId);
  },

  async getOrganization(tenantId: string, id: string): Promise<Organization | null> {
    await delay(300);
    return mockOrganizations.find(org => org.id === id && org.tenantId === tenantId) || null;
  },

  async createOrganization(tenantId: string, data: Omit<Organization, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    await delay(800);
    const newOrg: Organization = {
      ...data,
      id: 'org-' + Date.now(),
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOrganizations.push(newOrg);
    return newOrg;
  },

  async updateOrganization(tenantId: string, id: string, data: Partial<Organization>): Promise<Organization> {
    await delay(600);
    const index = mockOrganizations.findIndex(org => org.id === id && org.tenantId === tenantId);
    if (index === -1) throw new Error('Organization not found');
    
    mockOrganizations[index] = {
      ...mockOrganizations[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockOrganizations[index];
  },

  async deleteOrganization(tenantId: string, id: string): Promise<void> {
    await delay(500);
    const index = mockOrganizations.findIndex(org => org.id === id && org.tenantId === tenantId);
    if (index === -1) throw new Error('Organization not found');
    mockOrganizations.splice(index, 1);
  },

  // Users
  async getUsers(tenantId: string): Promise<User[]> {
    await delay(500);
    return mockUsers.filter(user => user.tenantId === tenantId);
  },

  async getUser(tenantId: string, id: string): Promise<User | null> {
    await delay(300);
    return mockUsers.find(user => user.id === id && user.tenantId === tenantId) || null;
  },

  async createUser(tenantId: string, data: Omit<User, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await delay(800);
    const newUser: User = {
      ...data,
      id: 'user-' + Date.now(),
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async updateUser(tenantId: string, id: string, data: Partial<User>): Promise<User> {
    await delay(600);
    const index = mockUsers.findIndex(user => user.id === id && user.tenantId === tenantId);
    if (index === -1) throw new Error('User not found');
    
    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockUsers[index];
  },

  // Roles
  async getRoles(tenantId: string): Promise<Role[]> {
    await delay(500);
    return mockRoles.filter(role => role.tenantId === tenantId);
  },

  async getRole(tenantId: string, id: string): Promise<Role | null> {
    await delay(300);
    return mockRoles.find(role => role.id === id && role.tenantId === tenantId) || null;
  },

  async createRole(tenantId: string, data: Omit<Role, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    await delay(800);
    const newRole: Role = {
      ...data,
      id: 'role-' + Date.now(),
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRoles.push(newRole);
    return newRole;
  },

  async updateRole(tenantId: string, id: string, data: Partial<Role>): Promise<Role> {
    await delay(600);
    const index = mockRoles.findIndex(role => role.id === id && role.tenantId === tenantId);
    if (index === -1) throw new Error('Role not found');
    
    mockRoles[index] = {
      ...mockRoles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockRoles[index];
  },

  // Privileges
  async getPrivileges(tenantId: string): Promise<Privilege[]> {
    await delay(500);
    return mockPrivileges.filter(priv => priv.tenantId === tenantId);
  },

  async getPrivilege(tenantId: string, id: string): Promise<Privilege | null> {
    await delay(300);
    return mockPrivileges.find(priv => priv.id === id && priv.tenantId === tenantId) || null;
  },

  async createPrivilege(tenantId: string, data: Omit<Privilege, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<Privilege> {
    await delay(800);
    const newPrivilege: Privilege = {
      ...data,
      id: 'priv-' + Date.now(),
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPrivileges.push(newPrivilege);
    return newPrivilege;
  },

  async updatePrivilege(tenantId: string, id: string, data: Partial<Privilege>): Promise<Privilege> {
    await delay(600);
    const index = mockPrivileges.findIndex(priv => priv.id === id && priv.tenantId === tenantId);
    if (index === -1) throw new Error('Privilege not found');
    
    mockPrivileges[index] = {
      ...mockPrivileges[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockPrivileges[index];
  },

  // Legal Entities
  async getLegalEntities(tenantId: string): Promise<LegalEntity[]> {
    await delay(500);
    return mockLegalEntities.filter(entity => entity.tenantId === tenantId);
  },

  async getLegalEntity(tenantId: string, id: string): Promise<LegalEntity | null> {
    await delay(300);
    return mockLegalEntities.find(entity => entity.id === id && entity.tenantId === tenantId) || null;
  },

  async createLegalEntity(tenantId: string, data: Omit<LegalEntity, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<LegalEntity> {
    await delay(800);
    const newEntity: LegalEntity = {
      ...data,
      id: 'legal-' + Date.now(),
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLegalEntities.push(newEntity);
    return newEntity;
  },

  async updateLegalEntity(tenantId: string, id: string, data: Partial<LegalEntity>): Promise<LegalEntity> {
    await delay(600);
    const index = mockLegalEntities.findIndex(entity => entity.id === id && entity.tenantId === tenantId);
    if (index === -1) throw new Error('Legal entity not found');
    
    mockLegalEntities[index] = {
      ...mockLegalEntities[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockLegalEntities[index];
  },

  // Role-Privilege operations
  async linkPrivilegeToRole(tenantId: string, roleId: string, privilegeId: string): Promise<void> {
    await delay(400);
    const role = mockRoles.find(r => r.id === roleId && r.tenantId === tenantId);
    if (!role) throw new Error('Role not found');
    
    if (!role.privileges.includes(privilegeId)) {
      role.privileges.push(privilegeId);
      role.updatedAt = new Date().toISOString();
    }
  },

  async unlinkPrivilegeFromRole(tenantId: string, roleId: string, privilegeId: string): Promise<void> {
    await delay(400);
    const role = mockRoles.find(r => r.id === roleId && r.tenantId === tenantId);
    if (!role) throw new Error('Role not found');
    
    role.privileges = role.privileges.filter(p => p !== privilegeId);
    role.updatedAt = new Date().toISOString();
  },

  // User-Role operations
  async assignRoleToUser(tenantId: string, userId: string, roleId: string): Promise<void> {
    await delay(400);
    const user = mockUsers.find(u => u.id === userId && u.tenantId === tenantId);
    if (!user) throw new Error('User not found');
    
    if (!user.roles.includes(roleId)) {
      user.roles.push(roleId);
      user.updatedAt = new Date().toISOString();
    }
  },

  async removeRoleFromUser(tenantId: string, userId: string, roleId: string): Promise<void> {
    await delay(400);
    const user = mockUsers.find(u => u.id === userId && u.tenantId === tenantId);
    if (!user) throw new Error('User not found');
    
    user.roles = user.roles.filter(r => r !== roleId);
    user.updatedAt = new Date().toISOString();
  },
};
