"use client"

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Control,
  FieldValues,
  Path,
  useController,
} from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface FormMultiSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormMultiSelect<TFieldValues extends FieldValues>({
  control,
  name,
  options,
  placeholder = "Select one or more",
  disabled = false,
  className,
}: FormMultiSelectProps<TFieldValues>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const selected = (value ?? []) as string[];

  const toggleSelect = (val: string) => {
    const updated = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(updated);
  };

  const removeTag = (val: string) => {
    onChange(selected.filter((v) => v !== val));
  };

  return (
    <div className={className}>
      <Select onValueChange={toggleSelect} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((val) => {
          const item = options.find((o) => o.value === val);
          return (
            <Badge key={val} variant="secondary" className="flex items-center gap-1">
              {item?.label}
              <button type="button" onClick={() => removeTag(val)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

// Async version placeholder (API driven options)
export function useAsyncOptions(endpoint: string) {
  const [options, setOptions] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOptions() {
      try {
        setLoading(true);
        const res = await fetch(endpoint);
        const data = await res.json();
        setOptions(data.map((item: any) => ({ value: item.id, label: item.title || item.name })));
      } catch (e) {
        console.error("Failed to fetch options", e);
      } finally {
        setLoading(false);
      }
    }

    fetchOptions();
  }, [endpoint]);

  return { options, loading };
}
