import { useId } from 'react'

type RadioOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

type RadioGroupProps = {
  name: string
  label: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  variant?: 'default' | 'card'
  orientation?: 'vertical' | 'horizontal'
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
  className?: string
}

export default function RadioGroup({
  name, label, options, value, onChange,
  variant = 'default', orientation = 'vertical',
  required = false, disabled = false, error, helperText, className = '',
}: RadioGroupProps) {
  const groupId = useId()
  const errorId = `${groupId}-error`
  const helperId = `${groupId}-helper`

  return (
    <fieldset disabled={disabled} className={`min-w-0 space-y-3 ${className}`}>
      <legend className="text-muv-label font-medium text-foreground">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
      </legend>
      {helperText && <p id={helperId} className="text-muv-small text-muted">{helperText}</p>}
      <div className={orientation === 'horizontal' ? 'grid gap-3 sm:grid-cols-2' : 'flex flex-col gap-3'}>
        {options.map((option, index) => {
          const optionId = `${groupId}-${index}`
          const descriptionId = `${optionId}-description`
          const isSelected = value === option.value
          const isDisabled = disabled || option.disabled
          const descriptionIds = [
            helperText ? helperId : undefined,
            error ? errorId : undefined,
            option.description ? descriptionId : undefined,
          ].filter(Boolean).join(' ')

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`flex min-w-0 items-start gap-3
                ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                ${variant === 'card' ? `rounded-muv-card border p-4 transition-colors
                  ${isSelected ? 'border-primary bg-primary-light' : 'border-border bg-surface'}
                  ${!isDisabled ? 'hover:border-primary' : ''}` : 'py-1'}`}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={descriptionIds || undefined}
                onChange={() => onChange(option.value)}
                className="mt-0.5 size-5 shrink-0 accent-primary cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{option.label}</span>
                {option.description && (
                  <span id={descriptionId} className="mt-1 block text-muv-small text-muted">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>
      {error && <p id={errorId} className="text-muv-small font-medium text-danger">{error}</p>}
    </fieldset>
  )
}
