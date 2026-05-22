"use client";

import React from "react";

interface FormSectionProps {
  number: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}

export default function FormSection({
  number,
  title,
  subtitle,
  icon,
  iconBg,
  children,
}: FormSectionProps) {
  return (
    <section className="neo-card overflow-hidden mb-6">
      <div className="flex items-start gap-3 p-4 border-b-[3px] border-black bg-white">
        <div
          className="p-2 rounded-xl border-2 border-black flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-[#0047b3] tracking-widest">{number}</p>
          <h2 className="text-lg font-black tracking-tight uppercase leading-tight">{title}</h2>
          {subtitle && (
            <p className="text-xs font-semibold text-gray-500 mt-1 leading-snug">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-4 space-y-5 bg-white">{children}</div>
    </section>
  );
}

interface FieldBlockProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FieldBlock({ label, required, hint, children }: FieldBlockProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold leading-snug block">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-500 font-medium">{hint}</p>}
      {children}
    </div>
  );
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="neo-input w-full min-h-[80px] text-sm resize-none"
    />
  );
}

export function TextInputField({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={`neo-input w-full ${className}`}
    />
  );
}
