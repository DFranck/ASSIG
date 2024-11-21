'use client';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  name,
  label,
  placeholder,
}) => {
  const { register, formState } = useFormContext();

  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <Textarea
        {...register(name)}
        placeholder={placeholder}
        className="resize-none h-auto"
      />
      {formState.errors[name] && (
        <p className="text-red-500 text-sm">
          {formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};
