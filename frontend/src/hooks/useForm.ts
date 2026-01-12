// hooks/useForm.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  redirectPath?: string;
  validate?: (values: T) => string | null;
}

export const useForm = <T extends Record<string, string>>({
  initialValues,
  onSubmit,
  redirectPath,
  validate,
}: UseFormOptions<T>) => {
  const navigate = useNavigate();
  const [values, setValues] = useState<T>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación personalizada
    if (validate) {
      const validationError = validate(values);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(values);
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setError("");
  };

  return {
    values,
    loading,
    error,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setError,
  };
};