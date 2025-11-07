"use client";

import type React from "react";
import { AlertCircle, type LucideIcon } from "lucide-react";

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: LucideIcon;
  placeholder?: string;
  name: string;
}

export const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  icon: Icon,
  placeholder,
  name,
}: FormInputProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>
      {error && (
        <div className="flex items-center mt-1 text-red-500 text-sm">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};
