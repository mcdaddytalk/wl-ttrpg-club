"use client"

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function FormSelect<TFieldValues extends FieldValues>({
  control,
  name,
  options,
  placeholder = "Select an option",
  className,
  disabled = false,
}: FormSelectProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);

        return (
          <div className={className}>
            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder}>
                  {selectedOption ? selectedOption.label : ""}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
