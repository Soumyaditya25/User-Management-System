import { AuditLog, AuditFilters } from '@/types/audit';

// Mock audit logs data
const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    userId: 'user-1',
    userName: 'John Doe',
    action: 'update',
    resourceType: 'user',
    resourceId: 'user-2',
    resourceName: 'Jane Smith',
    changes: [
      { field: 'status', oldValue: 'inactive', newValue: 'active' },
      { field: 'role', oldValue: 'user', newValue: 'admin' }
    ],
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  },
  {
    id: 'audit-2',
    userId: 'user-2',
    userName: 'Jane Smith',
    action: 'create',
    resourceType: 'organization',
    resourceId: 'org-4',
    resourceName: 'New Department',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    ipAddress: '192.168.1.2'
  },
  {
    id: 'audit-3',
    userId: 'user-1',
    userName: 'John Doe',
    action: 'login',
    resourceType: 'user',
    resourceId: 'user-1',
    resourceName: 'John Doe',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: '192.168.1.1'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const auditService = {
  async getAuditLogs(tenantId: string, filters?: AuditFilters): Promise<AuditLog[]> {
    await delay(500);
    let filteredLogs = [...mockAuditLogs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      if (filters.resourceType) {
        filteredLogs = filteredLogs.filter(log => log.resourceType === filters.resourceType);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.userName.toLowerCase().includes(term) ||
          log.resourceName.toLowerCase().includes(term) ||
          log.action.toLowerCase().includes(term)
        );
      }
      if (filters.dateFrom) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.dateTo!);
      }
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async logAction(tenantId: string, log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    await delay(200);
    const newLog: AuditLog = {
      ...log,
      id: 'audit-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    mockAuditLogs.unshift(newLog);
  }
};
