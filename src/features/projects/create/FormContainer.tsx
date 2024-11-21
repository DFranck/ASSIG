'use client'; // Indique que c'est un Client Component

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createProjectSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import LocationSelection from '../LocationSelection';
import { InputField } from './InputField';
import { TextareaField } from './TextareaField';

export const FormContainer = () => {
  const router = useRouter();
  const { toast } = useToast();
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
    const response = await fetch('/api/projects/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: 'Failed to create project',
        description: errorData.message,
        variant: 'destructive',
      });
      throw new Error(errorData.message || 'Failed to create project');
    } else {
      const responseData = await response.json();
      const projectId = responseData._id;
      console.log('Project ID:', projectId);
      toast({
        title: 'Project created successfully',
        description: 'Your project has been created successfully',
      });
      console.log('Redirecting to:', `/projects/${projectId}`);
      router.push(`/projects/${projectId}`);
      console.log('Redirection initiated');
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
