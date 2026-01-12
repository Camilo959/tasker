import { Link } from "react-router-dom";

interface DashboardCardProps {
  to: string;
  icon: string;
  title: string;
  description: string;
}

export const DashboardCard = ({ to, icon, title, description }: DashboardCardProps) => {
  return (
    <Link
      to={to}
      style={{
        padding: "30px 20px",
        border: "1px solid #ddd",
        textDecoration: "none",
        borderRadius: "8px",
        textAlign: "center",
        transition: "all 0.3s ease",
        backgroundColor: "white",
        color: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "10px" }}>{icon}</div>
      <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{title}</h2>
      <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{description}</p>
    </Link>
  );
};
