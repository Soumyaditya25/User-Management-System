import React, { useState } from 'react';
import { Search, Filter, X, Plus, Calendar, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

export interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: string | Date;
  type: 'text' | 'select' | 'date' | 'number';
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'number';
    options?: string[];
  }[];
  placeholder?: string;
}

export function AdvancedSearch({ onSearch, fields, placeholder = "Search..." }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const operators = {
    text: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' },
    ],
    select: [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not equals' },
    ],
    date: [
      { value: 'equals', label: 'On' },
      { value: 'before', label: 'Before' },
      { value: 'after', label: 'After' },
      { value: 'between', label: 'Between' },
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greater', label: 'Greater than' },
      { value: 'less', label: 'Less than' },
      { value: 'between', label: 'Between' },
    ],
  };

  const addFilter = () => {
    const newFilter: SearchFilter = {
      id: Date.now().toString(),
      field: fields[0]?.key || '',
      operator: 'contains',
      value: '',
      type: fields[0]?.type || 'text',
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (id: string, updates: Partial<SearchFilter>) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, ...updates } : filter
    ));
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const clearAllFilters = () => {
    setFilters([]);
    setQuery('');
    onSearch('', []);
  };

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'date':
        return <Calendar className="w-4 h-4" />;
      case 'select':
        return <Filter className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {filters.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filters.length}
            </Badge>
          )}
        </Button>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const field = fields.find(f => f.key === filter.field);
            return (
              <Badge key={filter.id} variant="outline" className="flex items-center gap-1">
                {getFieldIcon(filter.type)}
                {field?.label} {filter.operator} {String(filter.value)}
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Builder */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Advanced Filters
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Plus className="w-4 h-4 mr-1" />
                Add Filter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filters.map((filter) => {
              const field = fields.find(f => f.key === filter.field);
              const availableOperators = operators[filter.type] || operators.text;

              return (
                <div key={filter.id} className="flex gap-2 items-center p-3 border rounded-lg">
                  {/* Field Selection */}
                  <Select
                    value={filter.field}
                    onValueChange={(value) => {
                      const selectedField = fields.find(f => f.key === value);
                      updateFilter(filter.id, {
                        field: value,
                        type: selectedField?.type || 'text',
                        operator: operators[selectedField?.type || 'text'][0]?.value || 'contains',
                        value: '',
                      });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.key} value={field.key}>
                          <div className="flex items-center gap-2">
                            {getFieldIcon(field.type)}
                            {field.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator Selection */}
                  <Select
                    value={filter.operator}
                    onValueChange={(value) => updateFilter(filter.id, { operator: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOperators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Value Input */}
                  <div className="flex-1">
                    {filter.type === 'select' && field?.options ? (
                      <Select
                        value={String(filter.value)}
                        onValueChange={(value) => updateFilter(filter.id, { value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : filter.type === 'date' ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <Calendar className="mr-2 h-4 w-4" />
                            {filter.value instanceof Date ? format(filter.value, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={filter.value instanceof Date ? filter.value : undefined}
                            onSelect={(date) => updateFilter(filter.id, { value: date || new Date() })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Input
                        type={filter.type === 'number' ? 'number' : 'text'}
                        value={String(filter.value)}
                        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                        placeholder="Enter value"
                      />
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}

            {filters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No filters added yet. Click "Add Filter" to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
