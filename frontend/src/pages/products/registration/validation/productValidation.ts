import { Dispatch, SetStateAction, useState } from 'react';
import * as yup from 'yup';
import { ProductPayload } from 'types/product';

export type ProductValidation = {
  company_id?: string;
  name?: string;
  description?: string;
  price?: string;
  internal_code?: string;
};

type UseProductValidation = [
  ProductValidation,
  Dispatch<SetStateAction<ProductValidation>>,
  (product: ProductPayload) => Promise<void>,
];

/**
 * Espelha as regras do servidor, que continua sendo quem decide. Os campos são declarados
 * de baixo para cima porque o yup avalia o objeto nessa ordem.
 */
export function useProductValidation(): UseProductValidation {
  const [validation, setValidation] = useState<ProductValidation>({});

  async function handleValidation(product: ProductPayload) {
    const schema = yup.object().shape({
      description: yup.string().max(2000, 'A descrição deve ter no máximo 2.000 caracteres'),
      price: yup
        .string()
        .test('positive', 'O preço deve ser maior que zero', value => parseFloat(value ?? '0') > 0)
        .required('O preço é obrigatório'),
      internal_code: yup
        .string()
        .max(50, 'O código interno deve ter no máximo 50 caracteres')
        .required('O código interno é obrigatório'),
      name: yup
        .string()
        .min(3, 'O nome deve ter ao menos 3 caracteres')
        .max(150, 'O nome deve ter no máximo 150 caracteres')
        .required('O nome é obrigatório'),
      company_id: yup.number().typeError('Selecione a empresa do produto').required('Selecione a empresa do produto'),
    });

    try {
      await schema.validate(product);
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
