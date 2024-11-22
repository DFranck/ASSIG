import Section from '@/components/shared/section';
import { Input } from '@/components/ui/input';
import GoogleMapsComponent from '@/features/projects/create/GoogleMap';
import { ParamsWithId } from '@/types/api';
import { Metadata } from 'next';

async function fetchProjectDetails(id: string) {
  const baseUrl = process.env.AUTH_URL || 'http://localhost:3000';
  console.log('[FETCH] Fetching project details for ID:', id);
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

  return response.json();
}
export async function generateMetadata({
  params,
}: ParamsWithId): Promise<Metadata> {
  try {
    const project = await fetchProjectDetails(params.id);
    return {
      title: project.title || `Project ${params.id}`,
      description: project.description || `Details for project ${params.id}`,
    };
  } catch (error) {
    console.error('[Metadata] Error fetching project details:', error);
    return {
      title: `Project ${params.id}`,
      description: 'Project details could not be loaded.',
    };
  }
}

const PageProjectsProject = async ({ params }: ParamsWithId) => {
  try {
    const project = await fetchProjectDetails(params.id);

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
