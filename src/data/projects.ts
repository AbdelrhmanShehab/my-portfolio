import { supabase } from "@/lib/supabase";

export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  tools: string[];
  tags: string[];
  thumbnail: string;
  gallery?: string[];
  githubUrl?: string;
  liveUrl?: string;
  behanceUrl?: string;
  featured: boolean;
  metrics?: {
    label: string;
    value: string;
    icon?: string;
    description?: string;
    beforeImages?: string[];
    afterImages?: string[];
  }[];
}

// Map from DB (snake_case) to JS (camelCase)
const mapFromDB = (data: any): Project => ({
  id: data.id,
  title: data.title,
  description: data.description,
  problem: data.problem || "",
  solution: data.solution || "",
  tools: data.tools || [],
  tags: data.tags || [],
  thumbnail: data.thumbnail || "",
  gallery: data.gallery || [],
  githubUrl: data.github_url || "",
  liveUrl: data.live_url || "",
  featured: data.featured || false,
  behanceUrl: data.behance_url || "",
  metrics: (data.metrics || []).map((m: any) => ({
    ...m,
    // Support migration from single to plural
    beforeImages: m.beforeImages || (m.beforeImage ? [m.beforeImage] : []),
    afterImages: m.afterImages || (m.afterImage ? [m.afterImage] : [])
  })),
});

// Map from JS (camelCase) to DB (snake_case)
const mapToDB = (project: Project) => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    problem: project.problem,
    solution: project.solution,
    tools: project.tools,
    tags: project.tags,
    thumbnail: project.thumbnail || "",
    gallery: project.gallery || [],
    github_url: project.githubUrl,
    live_url: project.liveUrl,
    featured: project.featured,
    behance_url: project.behanceUrl || null,
    metrics: project.metrics?.map(m => {
      // Remove deprecated singular fields when saving to DB
      const { beforeImage, afterImage, ...rest } = m as any;
      return rest;
    }) || [],
  };
};

export const getProjectList = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects') 
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    return (data || []).map(mapFromDB);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const getProject = async (id: string): Promise<Project | undefined> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapFromDB(data);
  } catch (error) {
    console.error("Error fetching project:", error);
    return undefined;
  }
};

export const saveProject = async (project: Project): Promise<void> => {
  const dbData = mapToDB(project);
  const { error } = await supabase
    .from('projects')
    .upsert(dbData);

  if (error) throw error;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const reorderProjects = async (projectList: Project[]): Promise<void> => {
  console.log("Reordering in Supabase would require a display_order column.");
};

export const getAllTools = async (): Promise<string[]> => {
  const list = await getProjectList();
  const tools = new Set<string>();
  list.forEach(p => p.tools?.forEach(t => tools.add(t)));
  return Array.from(tools);
};

export const projects: Project[] = [];