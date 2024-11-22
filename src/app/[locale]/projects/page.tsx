import Section from '@/components/shared/section';
import ClientProjectComponent from '@/features/projects/ClientProjectComponent';
import { auth } from '@/lib/auth';
import { Project } from '@/models/projectModel';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Projets',
};

const pageProjects = async () => {
  const session = await auth();
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const projects: Project[] = await fetch(`${baseUrl}/api/projects`, {
    headers: headers(),
  }).then((res) => res.json());

  return (
    <Section className="my-5 md:my-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ClientProjectComponent projects={projects} session={session} />
    </Section>
  );
};

export default pageProjects;
