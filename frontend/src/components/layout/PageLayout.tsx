import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "../common/Button";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  backLink?: string;
  maxWidth?: string;
}

export const PageLayout = ({
  title,
  children,
  actions,
  backLink = "/dashboard",
  maxWidth = "1200px",
}: PageLayoutProps) => {
  return (
    <div style={{ padding: "20px", maxWidth, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>{title}</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          {actions}
          <Link to={backLink}>
            <Button variant="secondary">← Volver</Button>
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};
