"use client";

import type React from "react";

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const FormCard = ({ title, subtitle, children }: FormCardProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-center text-gray-600 mb-6 text-sm">{subtitle}</p>
      )}
      {children}
    </div>
  );
};
