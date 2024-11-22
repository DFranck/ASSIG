'use client';
import DeleteButton from '@/components/DeleteButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Project } from '@/models/projectModel';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { ObjectId } from 'mongodb';
import Link from 'next/link';
import { useState } from 'react';
import GoogleMapsComponent from './create/GoogleMap';

const ClientProjectComponent = ({
  session,
  projects: initialProjects,
}: {
  session: any;
  projects: Project[];
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
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
  const mapCenter = calculateMapCenter(projects);
  const removeProject = (projectId: ObjectId) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project._id !== projectId),
    );
  };
  return (
    <div>
      <div className="flex flex-col gap-2 h-full">
        <Collapsible className="w-full">
          <CollapsibleTrigger asChild className="cursor-pointer">
            <h1>Projets de {session?.user?.username}</h1>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {projects.length > 0 ? (
              <ul className="space-y-2">
                {projects.map((project: any) => (
                  <li key={`${project._id}`} className="w-full flex gap-2">
                    <Link
                      href={`/projects/${project._id}`}
                      className="block w-full p-2 bg-secondary text-secondary-foreground rounded-md truncate"
                    >
                      {project.title}
                    </Link>
                    <DeleteButton
                      projectId={project._id}
                      onClick={() => removeProject(project._id)}
                    />
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
        <GoogleMapsComponent mapCenter={mapCenter} projects={projects} />
      </div>
    </div>
  );
};

export default ClientProjectComponent;
