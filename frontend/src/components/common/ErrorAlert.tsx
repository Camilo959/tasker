interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) return null;

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#ffebee",
        color: "#c62828",
        borderRadius: "4px",
        marginBottom: "15px",
      }}
    >
      {message}
    </div>
  );
};
