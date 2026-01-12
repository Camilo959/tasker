import type { ChangeEvent } from "react";

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string | number; label: string }>;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder = "Seleccionar...",
  helperText,
}: FormSelectProps) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        {label} {required && "*"}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && (
        <small style={{ color: "#666", fontSize: "14px" }}>{helperText}</small>
      )}
    </div>
  );
};
