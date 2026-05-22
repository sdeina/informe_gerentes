"use client";

import { FieldBlock, TextAreaField } from "@/components/form/FormSection";

interface ConditionalCommentProps {
  show: boolean;
  label?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function ConditionalComment({
  show,
  label = "Comentarios",
  hint,
  value,
  onChange,
  placeholder = "Comentarios...",
  required,
}: ConditionalCommentProps) {
  if (!show && !value.trim()) return null;

  return (
    <FieldBlock label={label} required={required && show} hint={hint}>
      <TextAreaField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required && show}
      />
    </FieldBlock>
  );
}
