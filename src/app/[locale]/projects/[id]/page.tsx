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

    return (
      <div>
        <h1>{project.title || "Project's title"}</h1>
        <p>{project.description || "Project's description"}</p>
        <p>Formulaire dajout de pin ou import CSV</p>
        <p>SIG pour rendre les pins interactifs</p>
        <p>Édition des pins cliquées</p>
      </div>
    );
  } catch (error) {
    console.error('[PAGE] Error fetching project details:', error);
    return <p>Failed to load project details.</p>;
  }
};

export default PageProjectsProject;
