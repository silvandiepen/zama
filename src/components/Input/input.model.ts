import type { ReactNode } from 'react';

export type BaseFieldProps = {
  label?: string;
  help?: string;
  error?: string;
  id?: string;
  children?: ReactNode;
};

export type TextInputProps = BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>;

export type PasswordInputProps = BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>;

export type TextareaProps = BaseFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type CheckboxProps = BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement> & {
  checked?: boolean;
};

export type SwitchOption<T extends string> = {
  value: T;
  label: string;
  icon?: string;
};

export type SwitchButtonProps<T extends string> = BaseFieldProps & {
  value: T;
  options: Array<SwitchOption<T>>;
  onChange: (val: T) => void;
  disabled?: boolean;
};