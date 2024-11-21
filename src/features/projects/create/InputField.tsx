'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';

interface InputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
}) => {
  const { register, formState } = useFormContext();

  return (
    <>
      <Label>
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Input {...register(name)} type={type} placeholder={placeholder} />
      {formState.errors[name] && (
        <p className="text-red-500 text-sm">
          {formState.errors[name]?.message as string}
        </p>
      )}
    </>
  );
};
