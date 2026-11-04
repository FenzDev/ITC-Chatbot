import { useId, type ComponentProps } from "react";

export function Field({ label, id, ...rest }: ComponentProps<"input"> & { label: string }) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="eyebrow">{label}</label>
      <input id={fieldId} className="field" {...rest} />
    </div>
  );
}
