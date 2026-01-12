interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Cargando..." }: LoadingSpinnerProps) => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>{message}</p>
    </div>
  );
};
