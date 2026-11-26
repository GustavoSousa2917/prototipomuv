import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  description?: string
  error?: string
}

export default function Checkbox({
  id, label, description, error, required, disabled, className = '',
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId
  const descriptionId = `${checkboxId}-description`
  const errorId = `${checkboxId}-error`
  const descriptionIds = [
    describedBy,
    description ? descriptionId : undefined,
    error ? errorId : undefined,
  ].filter(Boolean).join(' ')

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={checkboxId}
        className={`flex items-start gap-3 ${disabled
          ? 'cursor-not-allowed text-muted'
          : 'cursor-pointer text-foreground'}`}
      >
        <input
          {...props}
          id={checkboxId}
          type="checkbox"
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : invalid}
          aria-describedby={descriptionIds || undefined}
          className="mt-0.5 size-5 shrink-0 accent-primary cursor-pointer disabled:cursor-not-allowed"
        />
        <span className="min-w-0">
          <span className="text-muv-body font-medium">
            {label}
            {required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
          </span>
          {description && (
            <span id={descriptionId} className="mt-1 block text-muv-small text-muted">
              {description}
            </span>
          )}
        </span>
      </label>
      {error && (
        <p id={errorId} className="ml-8 text-muv-small font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
