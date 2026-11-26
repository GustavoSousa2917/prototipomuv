import type { SelectHTMLAttributes } from 'react'

import FormField from '../forms/FormField'
import type { FormFieldOptions } from '../forms/FormField'

type SelectProps =
  SelectHTMLAttributes<HTMLSelectElement> &
  FormFieldOptions

export default function Select({
  label,
  helperText,
  error,
  id,
  required,
  children,
  className = '',
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: SelectProps) {
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
        <select
          {...props}
          {...control}
          required={required}
          className={`
            ${control.className}
            min-h-[var(--muv-input-height)]
            ${className}
          `}
        >
          {children}
        </select>
      )}
    </FormField>
  )
}