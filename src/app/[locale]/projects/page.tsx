import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Projets',
};
const pageProjects = async () => {
  const session = await auth();
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  // console.log('session', session);
  const projets = await fetch(`${baseUrl}/api/projects`, {
    headers: headers(),
  }).then((res) => res.json());

  console.log(projets);

  return (
    <div className="my-20">
      <h1>Projets de {session?.user?.username}</h1>
      <p>Liste des projets</p>
      {projets.length > 0 ? (
        <ul>
          {projets.map((project: any) => (
            <li key={project.id}>
              <Link href={`/projects/${project._id}`}>{project.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <Button>
          <Link href="/projects/create">Create your first project</Link>
        </Button>
      )}
      <Button>
        <Link href="/projects/create">Create a new project</Link>
      </Button>
    </div>
  );
};

export default pageProjects;
