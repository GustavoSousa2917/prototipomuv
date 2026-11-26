import type { InputHTMLAttributes } from 'react'

import FormField from '../forms/FormField'
import type { FormFieldOptions } from '../forms/FormField'

type InputProps =
  InputHTMLAttributes<HTMLInputElement> &
  FormFieldOptions

export default function Input({
  label,
  helperText,
  error,
  id,
  required,
  className = '',
  type = 'text',
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: InputProps) {
  return (
    <FormField
      id={id}
      label={label}
      helperText={helperText}
      error={error}
      required={required}
      describedBy={describedBy}
      invalid={invalid}
    >
      {(control) => (
        <input
          {...props}
          {...control}
          type={type}
          required={required}
          className={`
            ${control.className}
            min-h-[var(--muv-input-height)]
            ${className}
          `}
        />
      )}
    </FormField>
  )
}