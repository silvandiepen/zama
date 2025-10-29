import React from "react";
import { BaseField } from "./BaseField";
import { useBemm } from "@/utils/bemm";
import type { TextareaProps } from "./input.model";

export const Textarea: React.FC<TextareaProps> = ({ id, label, help, error, ...rest }) => {
  const bemm = useBemm("textarea");
  return (
    <BaseField id={id} label={label} help={help} error={error}>
      <textarea id={id} className={bemm("")} {...rest} />
    </BaseField>
  );
};

