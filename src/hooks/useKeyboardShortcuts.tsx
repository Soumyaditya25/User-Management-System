
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface ShortcutConfig {
  key: string;
  description: string;
  action: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'ctrl+/',
      description: 'Show keyboard shortcuts',
      action: () => {
        // This will be handled by the KeyboardShortcuts component
      },
    },
    {
      key: 'g,d',
      description: 'Go to Dashboard',
      action: () => navigate('/'),
    },
    {
      key: 'g,u',
      description: 'Go to Users',
      action: () => navigate('/users'),
    },
    {
      key: 'g,t',
      description: 'Go to Tenants',
      action: () => navigate('/tenants'),
    },
    {
      key: 'g,o',
      description: 'Go to Organizations',
      action: () => navigate('/organizations'),
    },
    {
      key: 'g,r',
      description: 'Go to Roles',
      action: () => navigate('/roles'),
    },
    {
      key: 'g,p',
      description: 'Go to Privileges',
      action: () => navigate('/privileges'),
    },
    {
      key: 'g,l',
      description: 'Go to Legal Entities',
      action: () => navigate('/legal-entities'),
    },
    {
      key: 'g,a',
      description: 'Go to Audit Logs',
      action: () => navigate('/audit-logs'),
    },
    {
      key: 'g,s',
      description: 'Go to Reports',
      action: () => navigate('/reports'),
    },
    {
      key: 'ctrl+k',
      description: 'Quick search',
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
    },
    {
      key: 'escape',
      description: 'Close dialogs/modals',
      action: () => {
        const closeButton = document.querySelector('[data-shortcut="close"]') as HTMLButtonElement;
        if (closeButton) {
          closeButton.click();
        }
      },
    },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      // Allow Ctrl+/ and Escape even in inputs
      if (!(event.ctrlKey && event.key === '/') && event.key !== 'Escape') {
        return;
      }
    }

    // Handle sequence shortcuts (like g,d)
    if (event.key === 'g') {
      event.preventDefault();
      const startTime = Date.now();
      
      const handleSecondKey = (e: KeyboardEvent) => {
        if (Date.now() - startTime > 2000) {
          document.removeEventListener('keydown', handleSecondKey);
          return;
        }

        const sequence = `g,${e.key}`;
        const shortcut = shortcuts.find(s => s.key === sequence);
        
        if (shortcut && !shortcut.disabled) {
          e.preventDefault();
          shortcut.action();
        }
        
        document.removeEventListener('keydown', handleSecondKey);
      };
      
      document.addEventListener('keydown', handleSecondKey);
      return;
    }

    // Handle single key shortcuts
    const key = event.ctrlKey ? `ctrl+${event.key}` : event.key;
    const shortcut = shortcuts.find(s => s.key === key);
    
    if (shortcut && !shortcut.disabled) {
      event.preventDefault();
      shortcut.action();
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
}