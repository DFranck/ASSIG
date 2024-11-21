import { Metadata } from 'next';

interface Props {
  params: { id: string };
  project: { title: string; description: string };
}

async function fetchProjectDetails(id: string) {
  console.log(`[FETCH] Fetching project details for ID: ${id}`);
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/projects/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project details');
  }

  const data = await response.json();
  console.log(`[FETCH SUCCESS] Project details fetched for ID: ${id}`, data);
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await fetchProjectDetails(params.id);

  // On passe les données du projet dans une variable globale accessible à la page
  (globalThis as any).projectData = project;

  return {
    title: project.title || `Projet ${params.id}`,
    description: project.description || `Détails du projet ${params.id}`,
  };
}

// Composant de page optimisé
const PageProjectsProject = async ({ params }: Props) => {
  // On récupère les données du projet depuis la variable globale
  const project = (globalThis as any).projectData;

  console.log('[PAGE] Project details loaded:', project);

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>Formulaire d'ajout de pin ou import CSV</p>
      <p>SIG pour rendre les pins interactifs</p>
      <p>Édition des pins cliquées</p>
    </div>
  );
};

export default PageProjectsProject;
