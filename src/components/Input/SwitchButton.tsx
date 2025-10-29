import React from "react";
import { useBemm } from "@/utils/bemm";
import { BaseField } from "./BaseField";
import { Icon } from "@/components/Icon";
import "./input.scss";
import type { SwitchButtonProps } from "./input.model";

export function SwitchButton<T extends string>({ id, label, help, error, value, options, onChange, disabled }: SwitchButtonProps<T>) {
  const bemm = useBemm("switch");
  return (
    <BaseField id={id} label={label} help={help} error={error}>
      <div className={bemm("")} role="tablist" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            className={bemm("btn", { active: value === o.value })}
            onClick={() => !disabled && onChange(o.value)}
            type="button"
            role="tab"
            aria-selected={value === o.value}
            disabled={disabled}
          >
            {o.icon && <Icon name={o.icon} />}
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    </BaseField>
  );
}
