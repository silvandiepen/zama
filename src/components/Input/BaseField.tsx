import React from "react";
import { useBemm } from "@/utils/bemm";
import "./input.scss";
import type { BaseFieldProps } from "./input.model";

export const BaseField: React.FC<BaseFieldProps> = ({
  label,
  help,
  error,
  id,
  children,
}) => {
  const bemm = useBemm("field");
  return (
    <div className={bemm("", { error: !!error })}>
      {label && (
        <div className={bemm("label-container")}>
          <label className={bemm("label")} htmlFor={id}>
            {label}
          </label>
          {help && <div className={bemm("help")}>{help}</div>}
        </div>
      )}
      <div className={bemm("control")}>
        {children}

        {error && (
          <div className={bemm("error")} role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
