import { supabase } from "@/lib/supabase";

export interface GalleryItem {
  url: string;
  title?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  tools: string[];
  tags: string[];
  features?: string[];
  thumbnail: string;
  gallery?: string[];
  galleryItems?: GalleryItem[];
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
const mapFromDB = (data: any): Project => {
  const rawGallery = data.gallery || [];
  const galleryItems = rawGallery.map((item: string) => {
    try {
      if (item.trim().startsWith("{")) {
        const parsed = JSON.parse(item);
        return {
          url: parsed.url || "",
          title: parsed.title || "",
          description: parsed.description || ""
        };
      }
    } catch (e) {
      // Fallback to raw string
    }
    return { url: item, title: "", description: "" };
  });

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    problem: data.problem || "",
    solution: data.solution || "",
    tools: data.tools || [],
    tags: data.tags || [],
    features: data.tags || [],
    thumbnail: data.thumbnail || "",
    gallery: rawGallery,
    galleryItems: galleryItems,
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
  };
};

// Map from JS (camelCase) to DB (snake_case)
const mapToDB = (project: Project) => {
  const serializedGallery = (project.galleryItems || []).map(item => {
    if (item.title || item.description) {
      return JSON.stringify({
        url: item.url,
        title: item.title,
        description: item.description
      });
    }
    return item.url;
  });

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    problem: project.problem,
    solution: project.solution,
    tools: project.tools,
    tags: project.features || project.tags || [],
    thumbnail: project.thumbnail || "",
    gallery: serializedGallery.length > 0 ? serializedGallery : (project.gallery || []),
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
  const baseTime = new Date("2026-01-01T00:00:00Z").getTime();
  try {
    const updates = projectList.map((project, index) => {
      const newCreatedAt = new Date(baseTime + index * 60000).toISOString();
      return supabase
        .from('projects')
        .update({ created_at: newCreatedAt })
        .eq('id', project.id);
    });
    const results = await Promise.all(updates);
    const firstError = results.find(r => r.error);
    if (firstError) throw firstError.error;
  } catch (error) {
    console.error("Error reordering projects in Supabase:", error);
    throw error;
  }
};

export const getAllTools = async (): Promise<string[]> => {
  const list = await getProjectList();
  const tools = new Set<string>();
  list.forEach(p => p.tools?.forEach(t => tools.add(t)));
  return Array.from(tools);
};

export const projects: Project[] = [];