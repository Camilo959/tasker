import type { ReactNode, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import { ErrorAlert } from "../common/ErrorAlert";

interface FormLayoutProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitText?: string;
  loading?: boolean;
  error?: string;
  cancelLink: string;
}

export const FormLayout = ({
  title,
  children,
  onSubmit,
  submitText = "Guardar",
  loading = false,
  error,
  cancelLink,
}: FormLayoutProps) => {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{title}</h1>

      <form onSubmit={onSubmit}>
        {children}

        {error && <ErrorAlert message={error} />}

        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Guardando..." : submitText}
          </Button>

          <Link to={cancelLink}>
            <Button variant="secondary">Cancelar</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};
