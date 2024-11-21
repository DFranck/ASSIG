import Section from '@/components/shared/section';
import { Input } from '@/components/ui/input';
import GoogleMapsComponent from '@/features/projects/create/GoogleMap';
import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

async function fetchProjectDetails(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/projects/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    console.error(
      `[FETCH] Error fetching project: ${response.status} - ${errorDetails}`,
    );
    throw new Error(`Failed to fetch project details: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await fetchProjectDetails(params.id);

  return {
    title: project.title || `Projet ${params.id}`,
    description: project.description || `Détails du projet ${params.id}`,
  };
}

const PageProjectsProject = async ({ params }: Props) => {
  try {
    const project = await fetchProjectDetails(params.id);
    console.log('[PAGE] Project details loaded:', project);

    if (!project) {
      return <p>Project not found</p>;
    }
    const mapCenter = { lat: project.latitude, lng: project.longitude };
    const pins = project.pins;
    return (
      <Section className="my-5 md:my-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col h-full w-full">
          <h1>{project.title || "Project's title"}</h1>
          <p className="text-left">
            {project.description || "Project's description"}
          </p>
          <Input type="search" placeholder="Rechercher" />
          <div className="hidden md:block">
            <p>Infos sur le projet visible que en tablette desktop</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="w-full h-96">
            <GoogleMapsComponent
              mapCenter={mapCenter}
              projects={pins ? pins : []}
            />
          </div>
          <p className="text-left">Formulaire dajout de pin ou import CSV</p>
          <p>SIG pour rendre les pins interactifs</p>
          <p>Édition des pins cliquées</p>
        </div>
      </Section>
    );
  } catch (error) {
    console.error('[PAGE] Error fetching project details:', error);
    return <p>Failed to load project details.</p>;
  }
};

export default PageProjectsProject;
