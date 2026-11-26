import type {
  TextareaHTMLAttributes,
} from 'react'

import FormField from '../forms/FormField'
import type { FormFieldOptions } from '../forms/FormField'

type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> &
  FormFieldOptions

export default function Textarea({
  label,
  helperText,
  error,
  id,
  required,
  className = '',
  rows = 4,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: TextareaProps) {
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
        <textarea
          {...props}
          {...control}
          required={required}
          rows={rows}
          className={`
            ${control.className}
            min-h-24 resize-y
            ${className}
          `}
        />
      )}
    </FormField>
  )
}