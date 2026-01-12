import type { CSSProperties, ReactNode } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  style?: CSSProperties;
}

export const Button = ({
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  children,
  style,
}: ButtonProps) => {
  const getVariantStyles = (): CSSProperties => {
    const base: CSSProperties = {
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      fontSize: "14px",
      fontWeight: "500",
    };

    const variants: Record<string, CSSProperties> = {
      primary: { ...base, backgroundColor: "#4caf50", color: "white" },
      secondary: { ...base, backgroundColor: "#9e9e9e", color: "white" },
      danger: { ...base, backgroundColor: "#f44336", color: "white" },
    };

    return variants[variant];
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...getVariantStyles(), ...style }}
    >
      {children}
    </button>
  );
};
