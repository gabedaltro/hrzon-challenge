import { AxiosError } from 'axios';

type ValidationErrorResponse = {
  errors?: Record<string, string[]>;
};

/**
 * Converte os erros de validação da API (`{ campo: ["mensagem"] }`) no formato usado
 * pelos formulários, para que a recusa do servidor apareça no campo correspondente.
 */
export function apiValidationErrors<T>(err: unknown): T | null {
  const error = err as AxiosError<ValidationErrorResponse>;
  const errors = error.response?.data?.errors;

  if (!errors) return null;

  return Object.entries(errors).reduce((validation, [field, messages]) => {
    return { ...validation, [field]: messages[0] };
  }, {} as T);
}
