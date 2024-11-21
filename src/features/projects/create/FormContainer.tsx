'use client'; // Indique que c'est un Client Component

import { Button } from '@/components/ui/button';
import { createProjectSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import LocationSelection from '../LocationSelection';
import { InputField } from './InputField';
import { TextareaField } from './TextareaField';

export const FormContainer = () => {
  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      latitude: 0,
      longitude: 0,
      mapZoom: 14,
    },
  });
  const onSubmit = async (data: any) => {
    console.log(data);
    return;
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create project');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        id="project-create-form"
        className="flex flex-col gap-4"
      >
        <InputField name="title" label="Title" />
        <TextareaField name="description" label="Description" />
        <LocationSelection />
        <Button>Create Project</Button>
      </form>
    </FormProvider>
  );
};
