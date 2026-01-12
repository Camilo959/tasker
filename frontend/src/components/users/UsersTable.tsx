interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  const getRoleBadge = (role: string) => {
    const isAdmin = role === "ADMIN";
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          backgroundColor: isAdmin ? "#2196f3" : "#4caf50",
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {isAdmin ? "ADMIN" : "EMPLEADO"}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "12px",
        backgroundColor: isActive ? "#4caf50" : "#f44336",
        color: "white",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {isActive ? "ACTIVO" : "INACTIVO"}
    </span>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Nombre</th>
            <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>Rol</th>
            <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>Estado</th>
            <th style={{ padding: "12px", textAlign: "center", border: "1px solid #ddd" }}>Fecha Registro</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>{user.id}</td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>{user.name}</td>
              <td style={{ padding: "12px", border: "1px solid #ddd" }}>{user.email}</td>
              <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                {getRoleBadge(user.role)}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                {getStatusBadge(user.isActive)}
              </td>
              <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
