import { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';

type MoneyInputProps = {
  name: string;
  onChange(event: { target: { name: string; value: string } }): void;
};

/** Entrega para o formulário o valor sem máscara ("1234.56"), que é o que a API espera. */
const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { name, onChange, ...other },
  ref,
) {
  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={values => onChange({ target: { name, value: values.value } })}
      decimalScale={2}
      decimalSeparator=","
      thousandSeparator="."
      valueIsNumericString
      allowNegative={false}
      prefix="R$ "
    />
  );
});

export default MoneyInput;
