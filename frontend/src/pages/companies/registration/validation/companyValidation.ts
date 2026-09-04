import { Dispatch, SetStateAction, useState } from 'react';
import * as yup from 'yup';
import { cnpjValidator } from 'helpers/cnpjValidator';
import { CompanyPayload } from 'types/company';

export type CompanyValidation = {
  name?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
};

type UseCompanyValidation = [
  CompanyValidation,
  Dispatch<SetStateAction<CompanyValidation>>,
  (company: CompanyPayload) => Promise<void>,
];

/**
 * As mesmas regras existem no servidor, que é quem decide. Aqui elas evitam uma ida
 * à API para apontar o erro no campo certo enquanto o usuário ainda está no formulário.
 * Os campos são declarados de baixo para cima porque o yup avalia o objeto nessa ordem.
 */
export function useCompanyValidation(): UseCompanyValidation {
  const [validation, setValidation] = useState<CompanyValidation>({});

  async function handleValidation(company: CompanyPayload) {
    const schema = yup.object().shape({
      phone: yup
        .string()
        .test('phone', 'Informe o telefone com DDD', value => /^\d{10,11}$/.test((value ?? '').replace(/\D/g, '')))
        .required('O telefone é obrigatório'),
      email: yup.string().email('Informe um e-mail válido').required('O e-mail é obrigatório'),
      cnpj: yup
        .string()
        .test('cnpj', 'Informe um CNPJ válido', value => cnpjValidator(value))
        .required('O CNPJ é obrigatório'),
      name: yup
        .string()
        .min(3, 'O nome deve ter ao menos 3 caracteres')
        .max(150, 'O nome deve ter no máximo 150 caracteres')
        .required('O nome é obrigatório'),
    });

    try {
      await schema.validate(company);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setValidation({
          [err.path as string]: err.message,
        });
      }

      throw err;
    }
  }

  return [validation, setValidation, handleValidation];
}
