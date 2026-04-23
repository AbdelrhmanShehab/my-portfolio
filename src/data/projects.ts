import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

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

export const projects: Project[] = [
  // ... (static projects)
  {
    id: "luxe-commerce",
    title: "Luxe Commerce",
    description: "A high-converting e-commerce platform that increased client revenue by 340%.",
    problem: "The client had an outdated Shopify store with a 1.2% conversion rate and poor mobile experience. Cart abandonment was at 78%.",
    solution: "Built a custom headless commerce experience with Next.js, optimized checkout flow, added real-time inventory updates, and implemented AI-powered product recommendations.",
    tools: ["Next.js", "Stripe", "Sanity CMS", "Tailwind CSS", "Vercel"],
    tags: ["E-Commerce", "Next.js", "UI/UX"],
    thumbnail: project1,
    gallery: [project1],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    id: "metrics-dashboard",
    title: "Metrics Dashboard",
    description: "Real-time analytics dashboard for a SaaS startup tracking 2M+ daily events.",
    problem: "The team relied on scattered spreadsheets and manual reporting. Decision-making was slow, and data was often 24 hours behind.",
    solution: "Designed and built a real-time analytics dashboard with live data streaming, custom chart components, role-based access, and automated PDF reporting.",
    tools: ["React", "D3.js", "Node.js", "PostgreSQL", "WebSockets"],
    tags: ["SaaS", "React", "Data Viz"],
    thumbnail: project2,
    gallery: [project2],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    id: "vitality-app",
    title: "Vitality App",
    description: "A fitness tracking mobile app with 50K+ downloads in the first month.",
    problem: "Existing fitness apps overwhelmed users with complexity. The client wanted a minimal, habit-focused approach that actually keeps users engaged.",
    solution: "Created a beautifully minimal fitness app with streak-based gamification, smart workout suggestions, and social accountability features.",
    tools: ["React Native", "Firebase", "Figma", "Lottie"],
    tags: ["Mobile", "React Native", "UI/UX"],
    thumbnail: project3,
    gallery: [project3],
    behanceUrl: "https://behance.net",
    featured: true,
  },
];

const LOCAL_STORAGE_KEY = "portfolio_custom_projects";

export function getProjectList(): Project[] {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  const customProjects: Project[] = saved ? JSON.parse(saved) : [];
  return [...customProjects, ...projects];
}

export function saveProject(project: Project) {
  const current = getProjectList().filter(p => !projects.find(sp => sp.id === p.id)); // only custom ones
  const updated = [project, ...current.filter(p => p.id !== project.id)];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

export function deleteProject(id: string) {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!saved) return;
  const customProjects: Project[] = JSON.parse(saved);
  const updated = customProjects.filter(p => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

export function getProject(id: string): Project | undefined {
  return getProjectList().find((p) => p.id === id);
}

export function getProjectsByTag(tag: string): Project[] {
  return getProjectList().filter((p) => p.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getProjectList().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}
