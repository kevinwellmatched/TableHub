type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  required?: boolean;
};

export function FormField({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  placeholder,
  error,
  minLength,
  maxLength,
  pattern,
  required = true,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        required={required}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#FCA311] focus:ring-2 focus:ring-[#FCA311]/20"
      />
      {error ? (
        <span id={`${name}-error`} className="mt-2 block text-sm text-[#FCA311]">
          {error}
        </span>
      ) : null}
    </label>
  );
}
