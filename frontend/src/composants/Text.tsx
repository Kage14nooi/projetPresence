import React from "react";
import { cn } from "../lib/utils";

type TextSize = "sm" | "md" | "lg" | "xl";
type TextVariant = "regular" | "medium" | "bold" | "light";
type TextColor = "primary" | "secondary" | "error" | "success";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize;
  variant?: TextVariant;
  color?: TextColor;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  size = "md",
  variant = "regular",
  color = "primary",
  className,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const variantClasses = {
    light: "font-light",
    regular: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
  };

  const colorClasses = {
    primary: "text-gray-800 dark:text-gray-100",
    secondary: "text-gray-500 dark:text-gray-400",
    error: "text-red-500",
    success: "text-green-500",
  };

  return (
    <p
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};
