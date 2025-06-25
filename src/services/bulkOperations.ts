import { User, Organization, Role } from './mockApi';

export interface BulkImportResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'excel';
  includeHeaders: boolean;
  selectedFields?: string[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const bulkOperationsService = {
  async importUsers(tenantId: string, file: File): Promise<BulkImportResult> {
    await delay(2000); // Simulate processing time
    
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0]?.split(',').map(h => h.trim());
    
    if (!headers || headers.length === 0) {
      throw new Error('Invalid CSV format: No headers found');
    }

    const result: BulkImportResult = {
      success: true,
      totalProcessed: lines.length - 1,
      successCount: 0,
      errorCount: 0,
      errors: []
    };

    // Process each row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const rowData: any = {};
      
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });

      try {
        // Validate required fields
        if (!rowData.username || !rowData.email || !rowData.firstName || !rowData.lastName) {
          throw new Error('Missing required fields: username, email, firstName, lastName');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(rowData.email)) {
          throw new Error('Invalid email format');
        }

        result.successCount++;
      } catch (error) {
        result.errorCount++;
        result.errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: rowData
        });
      }
    }

    result.success = result.errorCount === 0;
    return result;
  },

  async exportUsers(tenantId: string, users: User[], options: ExportOptions): Promise<Blob> {
    await delay(1000);

    const selectedFields = options.selectedFields || [
      'username', 'email', 'firstName', 'lastName', 'status', 'roles', 'organizationId', 'createdAt'
    ];

    if (options.format === 'csv') {
      const headers = options.includeHeaders ? selectedFields.join(',') + '\n' : '';
      const rows = users.map(user => {
        return selectedFields.map(field => {
          let value = user[field as keyof User];
          if (Array.isArray(value)) {
            value = value.join(';');
          }
          return `"${value || ''}"`;
        }).join(',');
      }).join('\n');

      return new Blob([headers + rows], { type: 'text/csv' });
    }

    // For Excel format, we'll create a simple CSV with Excel-friendly formatting
    const headers = options.includeHeaders ? selectedFields.join('\t') + '\n' : '';
    const rows = users.map(user => {
      return selectedFields.map(field => {
        let value = user[field as keyof User];
        if (Array.isArray(value)) {
          value = value.join(';');
        }
        return value || '';
      }).join('\t');
    }).join('\n');

    return new Blob([headers + rows], { type: 'application/vnd.ms-excel' });
  },

  generateUserTemplate(): Blob {
    const headers = 'username,email,firstName,lastName,status,organizationId\n';
    const sampleRow = 'john.doe,john.doe@company.com,John,Doe,active,org-1\n';
    return new Blob([headers + sampleRow], { type: 'text/csv' });
  }
};
