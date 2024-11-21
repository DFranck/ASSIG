import { FormContainer } from '@/features/projects/create/FormContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets create',
};

const PageProjectsCreate = () => {
  return (
    <div id="project-create-page" className="my-20 w-full max-w-2xl">
      <h1>Create Project</h1>
      <FormContainer />
    </div>
  );
};

export default PageProjectsCreate;
