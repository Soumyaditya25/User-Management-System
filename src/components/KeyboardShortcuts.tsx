import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Command } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const { shortcuts } = useKeyboardShortcuts();

  // Listen for Ctrl+/ to open shortcuts dialog
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const groupedShortcuts = {
    Navigation: shortcuts.filter(s => s.key.startsWith('g,')),
    Actions: shortcuts.filter(s => !s.key.startsWith('g,') && !s.key.includes('ctrl')),
    System: shortcuts.filter(s => s.key.includes('ctrl') || s.key === 'escape'),
  };

  const formatKey = (key: string) => {
    return key
      .split(',')
      .map(part => part.replace('ctrl+', 'Ctrl+'))
      .map(part => part === 'escape' ? 'Esc' : part)
      .join(' then ');
  };

  return (
    <>
      {/* Floating shortcut indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          title="Keyboard shortcuts (Ctrl+/)"
        >
          <Keyboard className="w-5 h-5" />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-shortcut="close">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Command className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3 text-foreground">{category}</h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut) => (
                    <div key={shortcut.key} className="flex items-center justify-between py-2">
                      <span className="text-foreground">{shortcut.description}</span>
                      <Badge variant="outline" className="font-mono">
                        {formatKey(shortcut.key)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Press <Badge variant="outline" className="mx-1 font-mono">Ctrl+/</Badge> to toggle this dialog
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
