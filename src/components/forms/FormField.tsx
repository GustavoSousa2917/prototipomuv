import { useId } from 'react'

import type {
  AriaAttributes,
  ReactNode,
} from 'react'

export type FormFieldOptions = {
  label: string
  helperText?: string
  error?: string
}

type FieldControl = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
  className: string
}

type FormFieldProps = FormFieldOptions & {
  id?: string
  required?: boolean
  describedBy?: string
  invalid?: AriaAttributes['aria-invalid']
  children: (control: FieldControl) => ReactNode
}

export default function FormField({
  id,
  label,
  helperText,
  error,
  required = false,
  describedBy,
  invalid,
  children,
}: FormFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId

  const helperId = `${fieldId}-helper`
  const errorId = `${fieldId}-error`

  const descriptionIds = [
    describedBy,
    helperText ? helperId : undefined,
    error ? errorId : undefined,
  ].filter(Boolean).join(' ')

  const controlClassName = `
    w-full min-w-0
    rounded-muv-input border
    bg-input px-3 py-2
    text-muv-body text-foreground
    transition-colors
    placeholder:text-muted
    disabled:cursor-not-allowed
    disabled:bg-neutral-light
    disabled:text-neutral

    ${error
      ? 'border-danger'
      : 'border-muted focus:border-primary'
    }
  `

  return (
    <div className="space-y-2">

      <label
        htmlFor={fieldId}
        className="block text-muv-label font-medium text-foreground"
      >
        {label}

        {required && (
          <span
            className="ml-1 text-danger"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {children({
        id: fieldId,
        'aria-describedby': descriptionIds || undefined,
        'aria-invalid': error ? true : invalid,
        className: controlClassName,
      })}

      {helperText && (
        <p
          id={helperId}
          className="text-muv-small text-muted"
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-muv-small font-medium text-danger"
        >
          {error}
        </p>
      )}

    </div>
  )
}