import Section from '@/components/shared/section';
import { FormContainer } from '@/features/projects/create/FormContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets create',
};

const PageProjectsCreate = () => {
  return (
    <Section id="project-create-page" className="my-5 md:my-10 px-4">
      <h1>Create Project</h1>
      <FormContainer />
    </Section>
  );
};

export default PageProjectsCreate;
