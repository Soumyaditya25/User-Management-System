import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Download, Upload, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { bulkOperationsService, BulkImportResult } from '@/services/bulkOperations';
import { User } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface BulkOperationsProps {
  users: User[];
  onImportComplete: () => void;
}

export function BulkOperations({ users, onImportComplete }: BulkOperationsProps) {
  const { user } = useAuth();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [importProgress, setImportProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setImportFile(file);
        setImportResult(null);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please select a CSV file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleImport = async () => {
    if (!importFile || !user?.tenantId) return;

    setImporting(true);
    setImportProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setImportProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const result = await bulkOperationsService.importUsers(user.tenantId, importFile);
      setImportResult(result);
      setImportProgress(100);
      
      if (result.success) {
        toast({
          title: 'Import completed successfully',
          description: `${result.successCount} users imported successfully.`,
        });
        onImportComplete();
      } else {
        toast({
          title: 'Import completed with errors',
          description: `${result.successCount} users imported, ${result.errorCount} errors.`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      clearInterval(progressInterval);
      setImporting(false);
    }
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      const blob = await bulkOperationsService.exportUsers(
        user?.tenantId || 'tenant-1',
        users,
        { format, includeHeaders: true }
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export completed',
        description: `Users exported as ${format.toUpperCase()} successfully.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export users.',
        variant: 'destructive',
      });
    }
  };

  const downloadTemplate = () => {
    const blob = bulkOperationsService.generateUserTemplate();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Template downloaded',
      description: 'User import template downloaded successfully.',
    });
  };

  return (
    <div className="flex space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Users
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Users</DialogTitle>
            <DialogDescription>
              Upload a CSV file to bulk import users
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-file">CSV File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={importing}
              />
              <p className="text-sm text-gray-500">
                Upload a CSV file with user data. 
                <Button variant="link" className="p-0 h-auto" onClick={downloadTemplate}>
                  Download template
                </Button>
              </p>
            </div>

            {importing && (
              <div className="space-y-2">
                <Label>Import Progress</Label>
                <Progress value={importProgress} className="w-full" />
                <p className="text-sm text-gray-500">{importProgress}% complete</p>
              </div>
            )}

            {importResult && (
              <Alert className={importResult.success ? 'border-green-500' : 'border-red-500'}>
                {importResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertDescription>
                  <div className="space-y-1">
                    <p>Import completed</p>
                    <p className="text-sm">
                      {importResult.successCount} successful, {importResult.errorCount} errors
                    </p>
                    {importResult.errors.length > 0 && (
                      <div className="mt-2 max-h-32 overflow-y-auto">
                        <p className="text-sm font-medium">Errors:</p>
                        {importResult.errors.slice(0, 5).map((error, index) => (
                          <p key={index} className="text-xs text-red-600">
                            Row {error.row}: {error.error}
                          </p>
                        ))}
                        {importResult.errors.length > 5 && (
                          <p className="text-xs text-gray-500">
                            +{importResult.errors.length - 5} more errors
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={downloadTemplate}>
                <FileText className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!importFile || importing}
              >
                {importing ? 'Importing...' : 'Import Users'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={() => handleExport('csv')}>
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>

      <Button variant="outline" onClick={() => handleExport('excel')}>
        <Download className="w-4 h-4 mr-2" />
        Export Excel
      </Button>
    </div>
  );
}
