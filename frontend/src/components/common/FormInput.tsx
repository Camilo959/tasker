import type { ChangeEvent } from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  helperText?: string;
}

export const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  minLength,
  helperText,
}: FormInputProps) => {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
      {helperText && (
        <small style={{ color: "#666", fontSize: "14px" }}>{helperText}</small>
      )}
    </div>
  );
};
