import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";

interface FormFieldProps extends ComponentProps<"input"> {
  label: string;
}

export default function FormField({ label, id, ...props }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input id={id} {...props} />
    </div>
  );
}
