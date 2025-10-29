import React from "react";
import { BaseField } from "./BaseField";
import { useBemm } from "@/utils/bemm";
import type { CheckboxProps } from "./input.model";

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, help, error, ...rest }) => {
  const bemm = useBemm("checkbox");
  return (
    <BaseField id={id} label={label} help={help} error={error}>
      <label className={bemm("")}> 
        <input id={id} type="checkbox" className={bemm("input")}
          {...rest}
        />
        <span className={bemm("visual")} aria-hidden />
      </label>
    </BaseField>
  );
};

