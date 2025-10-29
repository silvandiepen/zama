import { useBemm } from "@/utils/bemm";
import { BaseField } from "./BaseField";
import type { PasswordInputProps } from "./input.model";

export const PasswordInput: React.FC<PasswordInputProps> = ({ id, label, help, error, ...rest }) => {
  const bemm = useBemm("input");
  return (
    <BaseField id={id} label={label} help={help} error={error}>
      <input id={id} className={bemm("")} type="password" {...rest} />
    </BaseField>
  );
};

