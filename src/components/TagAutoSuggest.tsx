'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useTagSearch } from '@/hooks/useTagSearch';
import { cn } from '@/lib/utils';

export function TagAutoSuggest({
  value,
  onChange,
  placeholder = 'Add tag and press Enter',
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
  
    const suggestions = useTagSearch(input);
    const existing = value.map((v) => v.toLowerCase());
  
    const handleAdd = (tag: string) => {
      const clean = tag.toLowerCase();
      if (!existing.includes(clean)) {
        onChange([...value, clean]);
      }
      setInput('');
    };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && input.trim()) {
        e.preventDefault();
        handleAdd(input);
      }
    };
  
    const handleRemove = (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    };
  
    return (
      <div className="relative w-full">
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 border rounded px-2 py-2 min-h-[44px] bg-background',
            focused ? 'ring-2 ring-primary ring-offset-2' : ''
          )}
        >
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleRemove(tag)}
              />
            </Badge>
          ))}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-1"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>
  
        {suggestions.data && suggestions.data.length > 0 && input.length > 0 && (
          <div className="absolute left-0 right-0 z-10 mt-1 rounded-md border bg-popover shadow-md">
            {suggestions?.data?.map((tag) => (
              <div
                key={tag.id}
                onMouseDown={() => handleAdd(tag.name)}
                className="cursor-pointer px-3 py-2 hover:bg-muted"
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
}
