import Section from '@/components/shared/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GoogleMapsComponent from '@/features/projects/create/GoogleMap';
import { auth } from '@/lib/auth';
import { Project } from '@/models/projectModel';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projets',
};

const pageProjects = async () => {
  const session = await auth();
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const projets: Project[] = await fetch(`${baseUrl}/api/projects`, {
    headers: headers(),
  }).then((res) => res.json());
  const calculateMapCenter = (projects: Project[]) => {
    if (projects.length === 0) {
      return { lat: 0, lng: 0 }; // Valeur par défaut si aucun projet
    }

    const totalLat = projects.reduce(
      (sum, project) => sum + project.latitude,
      0,
    );
    const totalLng = projects.reduce(
      (sum, project) => sum + project.longitude,
      0,
    );

    return {
      lat: totalLat / projects.length,
      lng: totalLng / projects.length,
    };
  };

  // Calculer le centre de la carte
  const mapCenter = calculateMapCenter(projets);

  return (
    <Section className="my-5 md:my-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex flex-col gap-2 h-full">
        <Collapsible className="w-full">
          <CollapsibleTrigger asChild className="cursor-pointer">
            <h1>Projets de {session?.user?.username}</h1>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {projets.length > 0 ? (
              <ul className="space-y-2">
                {projets.map((project: any) => (
                  <li key={project.id} className="w-full">
                    <Link
                      href={`/projects/${project._id}`}
                      className="block w-full p-2 bg-secondary text-secondary-foreground rounded-md"
                    >
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p>Aucun projet disponible</p>
                <Button>
                  <Link href="/projects/create">Create your first project</Link>
                </Button>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>
        <Button>
          <Link href="/projects/create">Create a new project</Link>
        </Button>
        <Input type="search" placeholder="Rechercher" />
      </div>
      <div className="w-full h-96 lg:col-span-2">
        <GoogleMapsComponent mapCenter={mapCenter} projects={projets} />
      </div>
    </Section>
  );
};

export default pageProjects;
