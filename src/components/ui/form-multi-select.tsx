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
  useController,
  FieldPathValue,
  FieldPathByValue
} from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface MultiSelectOption<V extends string = string> {
  value: V;
  label: string;
}

type StringArray = string[];

export interface FormMultiSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, StringArray>
> {
  control: Control<TFieldValues>;
  name: TName
  options: ReadonlyArray<MultiSelectOption>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormMultiSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPathByValue<TFieldValues, StringArray>
>({
  control,
  name,
  options,
  placeholder = "Select one or more",
  disabled = false,
  className,
}: FormMultiSelectProps<TFieldValues, TName>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController<TFieldValues, TName>({ name, control });

  const selected: StringArray = Array.isArray(
    value as FieldPathValue<TFieldValues, TName>
  )
    ? (value as unknown as StringArray)
    : [];

  const toggleSelect = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    onChange(next);
  };

  const removeTag = (val: string) => {
    onChange(selected.filter((v) => v !== val));
  };

  return (
    <div className={className}>
      <Select onValueChange={toggleSelect} disabled={disabled}>
        <SelectTrigger aria-invalid={!!error}>
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
              <button 
                type="button"
                aria-label={`Remove ${item?.label ?? val}`}
                onClick={() => removeTag(val)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      {error?.message && <p className="text-red-500 text-sm mt-1">{String(error.message)}</p>}
    </div>
  );
}

