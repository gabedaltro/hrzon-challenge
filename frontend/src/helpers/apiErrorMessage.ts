import { AxiosError } from 'axios';

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Mensagem que pode ser mostrada ao usuário final. A API responde as recusas de regra
 * de negócio em `message`; o restante vira um texto genérico, sem detalhe interno.
 */
export function apiErrorMessage(err: unknown, fallback = 'Não foi possível concluir a operação.'): string {
  const error = err as AxiosError<ApiErrorResponse>;

  if (error.response) {
    const { message, errors } = error.response.data ?? {};

    if (errors) {
      const [first] = Object.values(errors);
      if (first?.length) return first[0];
    }

    if (message) return message;

    return fallback;
  }

  if (error.request) return 'Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.';

  return fallback;
}
