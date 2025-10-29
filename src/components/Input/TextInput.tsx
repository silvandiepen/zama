import React from "react";
import { BaseField } from "./BaseField";
import { useBemm } from "@/utils/bemm";
import type { TextInputProps } from "./input.model";

/**
 * Text input field component with label, help text, and error handling.
 * @param {Object} props - Component props extending BaseFieldProps and input attributes
 * @returns {JSX.Element} The rendered text input field.
 */
export const TextInput: React.FC<TextInputProps> = ({ id, label, help, error, ...rest }) => {
  const bemm = useBemm("input");
  return (
    <BaseField id={id} label={label} help={help} error={error}>
      <input id={id} className={bemm("")} {...rest} />
    </BaseField>
  );
};

