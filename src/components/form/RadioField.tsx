"use client";

interface Option {
  value: string;
  label: string;
}

interface RadioFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
}

export default function RadioField({ name, value, onChange, options, required }: RadioFieldProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-required={required}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`cursor-pointer select-none text-xs font-black uppercase px-3 py-2 rounded-lg border-2 border-black transition-all ${
            value === opt.value
              ? "bg-[#0047b3] text-white shadow-[2px_2px_0px_0px_#000]"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export const YES_NO = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

export const SCALE_3 = [
  { value: "excelente", label: "Excelente" },
  { value: "adecuado", label: "Adecuado" },
  { value: "mejorar", label: "A mejorar" },
];

export const OCUPACION = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

export const CLIMA_VIP = [
  { value: "conformes", label: "Muy Conformes" },
  { value: "neutrales", label: "Neutrales" },
  { value: "quejas", label: "Con Quejas" },
];

export const LIBRO_NOVEDADES = [
  { value: "si", label: "Sí (Sin novedades de riesgo)" },
  { value: "no", label: "NO (Detallar abajo)" },
];
