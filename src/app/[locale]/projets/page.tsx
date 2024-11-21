import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Projets',
};
const pageProjects = async () => {
  const session = await auth();
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const projets = await fetch(`${baseUrl}/api/projects`).then((res) =>
    res.json(),
  );

  return (
    <div>
      <h1>Projets de {session?.user?.name}</h1>
      <p>Liste des projets</p>
      {projets.length > 0 ? (
        <ul>
          {projets.map((project: any) => (
            <li key={project.id}>
              <Link href={`/projets/${project.id}`}>{project.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <Button>
          <Link href="/projets/create">Create your first project</Link>
        </Button>
      )}
    </div>
  );
};

export default pageProjects;
