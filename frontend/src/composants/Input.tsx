import * as React from "react";

import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, className, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 px-3 py-2 transition-all duration-150 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
            error && "border-red-500 focus-within:ring-red-500",
            className
          )}
        >
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
          <input
            ref={ref}
            type={type}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            {...props}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
