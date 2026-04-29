import { getItem, setItem, removeItem } from "@/lib/storage";

export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  tools: string[];
  tags: string[];
  thumbnail: string;
  gallery: string[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  behanceUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [];

const STORAGE_KEY = "portfolio_custom_projects";
const ORDER_KEY = "portfolio_projects_order";

// Migration function to move data from localStorage to IndexedDB
async function migrateFromLocalStorage() {
  const oldProjects = localStorage.getItem("portfolio_custom_projects");
  const oldOrder = localStorage.getItem("portfolio_projects_order");

  if (oldProjects) {
    try {
      const parsed = JSON.parse(oldProjects);
      await setItem(STORAGE_KEY, parsed);
      localStorage.removeItem("portfolio_custom_projects");
    } catch (e) {
      console.error("Migration error (projects):", e);
    }
  }

  if (oldOrder) {
    try {
      const parsed = JSON.parse(oldOrder);
      await setItem(ORDER_KEY, parsed);
      localStorage.removeItem("portfolio_projects_order");
    } catch (e) {
      console.error("Migration error (order):", e);
    }
  }
}

// Run migration immediately
migrateFromLocalStorage();

export async function getProjectList(): Promise<Project[]> {
  try {
    const customProjects: Project[] = await getItem(STORAGE_KEY) || [];
    const allProjects = [...customProjects, ...projects];
    
    const orderIds: string[] | null = await getItem(ORDER_KEY);
    if (orderIds) {
      return allProjects.sort((a, b) => {
        const indexA = orderIds.indexOf(a.id);
        const indexB = orderIds.indexOf(b.id);
        
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return -1;
        if (indexB === -1) return 1;
        return indexA - indexB;
      });
    }
    
    return allProjects;
  } catch (error) {
    console.error("Error loading projects:", error);
    return projects;
  }
}

export async function saveProject(project: Project): Promise<void> {
  try {
    const customProjects: Project[] = await getItem(STORAGE_KEY) || [];
    
    let updated;
    const exists = customProjects.find(p => p.id === project.id);
    
    if (exists) {
      updated = customProjects.map(p => p.id === project.id ? project : p);
    } else {
      updated = [project, ...customProjects];
      
      const orderIds: string[] | null = await getItem(ORDER_KEY);
      if (orderIds) {
        if (!orderIds.includes(project.id)) {
          await setItem(ORDER_KEY, [project.id, ...orderIds]);
        }
      }
    }
    
    await setItem(STORAGE_KEY, updated);
  } catch (error) {
    console.error("Error saving project:", error);
    throw new Error("Failed to save project. Please try again.");
  }
}

export async function reorderProjects(newOrder: Project[]): Promise<void> {
  const orderIds = newOrder.map(p => p.id);
  await setItem(ORDER_KEY, orderIds);
}

export async function deleteProject(id: string): Promise<void> {
  const customProjects: Project[] = await getItem(STORAGE_KEY) || [];
  const updated = customProjects.filter(p => p.id !== id);
  await setItem(STORAGE_KEY, updated);
  
  const orderIds: string[] | null = await getItem(ORDER_KEY);
  if (orderIds) {
    const updatedOrder = orderIds.filter(orderId => orderId !== id);
    await setItem(ORDER_KEY, updatedOrder);
  }
}

export async function getProject(id: string): Promise<Project | undefined> {
  const list = await getProjectList();
  return list.find((p) => p.id === id);
}

export async function getProjectsByTag(tag: string): Promise<Project[]> {
  const list = await getProjectList();
  return list.filter((p) => p.tags.includes(tag) || p.tools.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
  const tags = new Set<string>();
  const list = await getProjectList();
  list.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

export async function getAllTools(): Promise<string[]> {
  const tools = new Set<string>();
  const list = await getProjectList();
  list.forEach((p) => p.tools.forEach((t) => tools.add(t)));
  return Array.from(tools);
}
