import { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Upload, X, ChevronUp, ChevronDown, Download, Code, Copy, Check } from "lucide-react";
import { projects, type Project, getProjectList, saveProject, deleteProject, reorderProjects } from "@/data/projects";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
const AdminDashboard = () => {
  const [galleryFiles, setGalleryFiles] = useState<string[]>([]);
  const [galleryTitles, setGalleryTitles] = useState<string[]>([]);
  const [galleryDescriptions, setGalleryDescriptions] = useState<string[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCvUploading, setIsCvUploading] = useState(false);
  
  // Store actual File objects for upload
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFileObjects, setGalleryFileObjects] = useState<File[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      const list = await getProjectList();
      setProjectList(list);
    };
    fetchProjects();
  }, []);

  const [cvFile, setCvFile] = useState<{ name: string; url: string } | null>(() => {
    const saved = localStorage.getItem("cv_metadata");
    return saved ? JSON.parse(saved) : null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    tools: "",
    features: "",
    githubUrl: "",
    liveUrl: "",
    behanceUrl: "",
    thumbnail: "",
    featured: false
  });

  const [metrics, setMetrics] = useState<{ 
    label: string; 
    value: string; 
    description?: string;
    beforeImages: string[];
    afterImages: string[];
    beforeFiles: (File | null)[];
    afterFiles: (File | null)[];
  }[]>([]);
  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 8 - galleryFiles.length;

    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s) to the gallery (Max 8)`);
      return;
    }

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Please keep images under 2MB.`);
        return;
      }

      setGalleryFileObjects(prev => [...prev, file]);
      setGalleryTitles(prev => [...prev, ""]);
      setGalleryDescriptions(prev => [...prev, ""]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryFiles((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as any).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnail: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('projects')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: "" }));
    setThumbnailFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in the title and description");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(editingId ? "Updating project..." : "Adding project...");

    try {
      let thumbnailUrl = formData.thumbnail;
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile);
      }

        // Build gallery items with correct URLs and titles/descriptions
        let fileIdx = 0;
        const finalGalleryItems: {url: string; title: string; description: string}[] = [];
        for (let i = 0; i < galleryFiles.length; i++) {
          const preview = galleryFiles[i];
          let url = preview;
          if (!preview.startsWith("http")) {
            const file = galleryFileObjects[fileIdx++];
            if (file) url = await uploadImage(file);
          }
          finalGalleryItems.push({
            url,
            title: galleryTitles[i] || "",
            description: galleryDescriptions[i] || ""
          });
        }

        // Upload metric images
        const updatedMetrics = await Promise.all(
          metrics.map(async (metric) => {
            const beforeImages = [...metric.beforeImages];
            const afterImages = [...metric.afterImages];

            for (let i = 0; i < metric.beforeFiles.length; i++) {
              const file = metric.beforeFiles[i];
              if (file) {
                const url = await uploadImage(file);
                if (beforeImages[i]) beforeImages[i] = url;
                else beforeImages.push(url);
              }
            }

            for (let i = 0; i < metric.afterFiles.length; i++) {
              const file = metric.afterFiles[i];
              if (file) {
                const url = await uploadImage(file);
                if (afterImages[i]) afterImages[i] = url;
                else afterImages.push(url);
              }
            }

            const { beforeFiles, afterFiles, ...rest } = metric;
            return { 
              ...rest, 
              beforeImages: beforeImages.filter(img => img), 
              afterImages: afterImages.filter(img => img) 
            };
          })
        );

        const newProject: Project = {
          id: editingId || formData.title.toLowerCase().replace(/\s+/g, "-"),
          title: formData.title,
          description: formData.description,
          problem: formData.problem,
          solution: formData.solution,
          tools: formData.tools.split(",").map(t => t.trim()).filter(t => t),
          tags: formData.features.split(",").map(t => t.trim()).filter(t => t),
          features: formData.features.split(",").map(t => t.trim()).filter(t => t),
          thumbnail: thumbnailUrl,
          gallery: finalGalleryItems.map(item => item.url),
          galleryItems: finalGalleryItems,
          githubUrl: formData.githubUrl,
          liveUrl: formData.liveUrl,
          behanceUrl: formData.behanceUrl,
          featured: formData.featured,
          metrics: updatedMetrics
        };

      await saveProject(newProject);
      setFormData({
        title: "",
        description: "",
        problem: "",
        solution: "",
        tools: "",
        features: "",
        githubUrl: "",
        liveUrl: "",
        behanceUrl: "",
        thumbnail: "",
        featured: false
      });
      setMetrics([]);
      toast.success(editingId ? "Project updated!" : "Project added successfully!", {
        action: {
          label: "Copy Code",
          onClick: () => copyProjectCode(newProject)
        }
      });
      setGalleryFiles([]);
      setGalleryFileObjects([]);
      setGalleryTitles([]);
      setGalleryDescriptions([]);
      setThumbnailFile(null);
      setEditingId(null);
      setShowForm(false);
      toast.dismiss(toastId);
      const list = await getProjectList();
      setProjectList(list);
    } catch (error) {
      console.error("FULL SAVE ERROR:", error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : "Failed to save project - Check console for details");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      problem: project.problem,
      solution: project.solution,
      tools: project.tools.join(", "),
      features: (project.features || project.tags || []).join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      behanceUrl: project.behanceUrl || "",
      thumbnail: project.thumbnail,
      featured: project.featured || false
    });
    setMetrics((project.metrics || []).map(m => ({
      label: m.label,
      value: m.value,
      description: m.description || "",
      beforeImages: m.beforeImages || [],
      afterImages: m.afterImages || [],
      beforeFiles: [null, null],
      afterFiles: [null, null]
    })));
    const existingItems = (project.galleryItems && project.galleryItems.length > 0)
      ? project.galleryItems
      : (project.gallery || []).map(url => ({ url, title: "", description: "" }));
    setGalleryFiles(existingItems.map(item => item.url));
    setGalleryTitles(existingItems.map(item => item.title || ""));
    setGalleryDescriptions(existingItems.map(item => item.description || ""));
    setEditingId(project.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    const list = await getProjectList();
    setProjectList(list);
    toast.success("Project deleted");
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newList = [...projectList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setProjectList(newList);
    await reorderProjects(newList);
    toast.success("Order updated");
  };

  const handleMoveDown = async (index: number) => {
    if (index === projectList.length - 1) return;
    const newList = [...projectList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setProjectList(newList);
    await reorderProjects(newList);
    toast.success("Order updated");
  };

  const handleCvUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setIsCvUploading(true);
      const toastId = toast.loading("Uploading CV to storage...");

      try {
        // Using a known working path prefix 'projects/' to avoid potential folder restrictions
        const filePath = `projects/resume.pdf`;
        
        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, file, {
            upsert: true,
            contentType: 'application/pdf'
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(filePath);

        // Append a timestamp to bypass browser cache
        const finalUrl = `${publicUrl}?t=${Date.now()}`;
        const metadata = { name: file.name, url: finalUrl };
        
        setCvFile(metadata);
        localStorage.setItem("cv_metadata", JSON.stringify(metadata));
        toast.success("CV uploaded successfully!", { id: toastId });
      } catch (error: any) {
        toast.error(`Upload failed: ${error.message || 'Unknown error'}`, { id: toastId });
        console.error("CV upload error:", error);
      } finally {
        setIsCvUploading(false);
      }
    }
  };

  const removeCv = () => {
    setCvFile(null);
    localStorage.removeItem("cv_metadata");
    if (cvInputRef.current) cvInputRef.current.value = "";
    toast.success("CV removed");
  };

  const getExportCode = () => {
    // Generate only when needed to avoid memory pressure
    return `export const projects: Project[] = ${JSON.stringify(projectList, null, 2)};`;
  };

  const getFullFileCode = () => {
    return `import { getItem, setItem, removeItem } from "@/lib/storage";

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
  }[];
}

export const getProjectList = async (): Promise<Project[]> => {
  const localProjects = await getItem("custom_projects") || [];
  const order = await getItem("projects_order") || [];
  
  const allProjects = [...projects, ...localProjects];
  
  if (order.length > 0) {
    allProjects.sort((a, b) => {
      const indexA = order.indexOf(a.id);
      const indexB = order.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }
  
  return allProjects;
};

export const getProject = async (id: string): Promise<Project | undefined> => {
  const list = await getProjectList();
  return list.find(p => p.id === id);
};

export const saveProject = async (project: Project): Promise<void> => {
  const localProjects = await getItem("custom_projects") || [];
  const index = localProjects.findIndex((p: Project) => p.id === project.id);
  
  if (index !== -1) {
    localProjects[index] = project;
  } else {
    localProjects.push(project);
  }
  
  await setItem("custom_projects", localProjects);
};

export const deleteProject = async (id: string): Promise<void> => {
  const localProjects = await getItem("custom_projects") || [];
  const filtered = localProjects.filter((p: Project) => p.id !== id);
  await setItem("custom_projects", filtered);
};

export const reorderProjects = async (projectList: Project[]): Promise<void> => {
  const order = projectList.map(p => p.id);
  await setItem("projects_order", order);
};

export const getAllTools = async (): Promise<string[]> => {
  const list = await getProjectList();
  const tools = new Set<string>();
  list.forEach(p => p.tools.forEach(t => tools.add(t)));
  return Array.from(tools);
};

export const projects: Project[] = ${JSON.stringify(projectList, null, 2)};
`;
  };

  const downloadProjectsFile = () => {
    const fileContent = getFullFileCode();
    const blob = new Blob([fileContent], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projects.ts";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("projects.ts download started!");
  };

  const copyProjectCode = (project: Project) => {
    navigator.clipboard.writeText(JSON.stringify(project, null, 2));
    toast.success(`${project.title} code snippet copied!`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container px-6 flex items-center justify-between h-16">
          <h1 className="font-display font-bold text-lg">
            <span className="text-primary">●</span> Dashboard
          </h1>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </div>

      <div className="container px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold">Projects</h2>
            <p className="text-muted-foreground text-sm mt-1">{projectList.length} projects total</p>
          </div>
          <button
            onClick={() => {
              if (!showForm) {
                setEditingId(null);
                setFormData({
                  title: "",
                  description: "",
                  problem: "",
                  solution: "",
                  tools: "",
                  tags: "",
                  githubUrl: "",
                  liveUrl: "",
                  behanceUrl: "",
                  thumbnail: ""
                });
                setGalleryFiles([]);
              }
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
          <button
            onClick={() => setShowExport(!showExport)}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-medium px-5 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Code className="w-4 h-4" /> Export for Deployment
          </button>
        </div>

        {showExport && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1C23] border border-accent/20 rounded-xl p-6 mb-8 overflow-hidden relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-display font-bold text-accent">Export Projects Data</h3>
                <p className="text-muted-foreground text-sm">Download the updated file or copy the code to <code className="text-primary">src/data/projects.ts</code>.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={downloadProjectsFile}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download projects.ts
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg transition-all border border-accent/20"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Full Array"}
                </button>
              </div>
            </div>
            
            <div className="bg-black/40 p-8 rounded-lg text-center border border-white/5 mb-6">
              <div className="max-w-md mx-auto">
                <Code className="w-12 h-12 text-accent/40 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">Data Ready for Export</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Code preview is hidden for performance due to large image data. Use the buttons above to copy or download your <strong>{projectList.length} projects</strong>.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left bg-background/50 p-4 rounded-lg border border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Total Projects</span>
                    <span className="text-xl font-display font-bold text-primary">{projectList.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">Export Format</span>
                    <span className="text-xl font-display font-bold text-accent">TypeScript</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                <strong>How to update:</strong> To make your projects permanent and visible in production, you have two options:
                <br />1. <strong>Easiest:</strong> Download the file above and replace <code className="mx-1 px-1 bg-primary/20 rounded text-primary">src/data/projects.ts</code> with it.
                <br />2. <strong>Manual:</strong> Copy the code block and replace the <strong>entire</strong> <code className="mx-1 px-1 bg-primary/20 rounded text-primary">export const projects</code> array at the bottom of the file.
                <br /><br /><span className="text-accent font-bold">This export includes all {projectList.length} projects (both existing and new ones).</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* CV Management Section */}
        <div className="bg-gradient-card rounded-xl border border-border p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold">CV Management</h3>
              <p className="text-muted-foreground text-sm">Update your resume for the home page</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={cvInputRef}
                onChange={handleCvUpload}
                accept=".pdf"
                className="hidden"
              />
              {cvFile ? (
                <div className="flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-lg border border-border">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[150px]">{cvFile.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">Current CV</span>
                  </div>
                  <button
                    onClick={removeCv}
                    className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => cvInputRef.current?.click()}
                  disabled={isCvUploading}
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-medium px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" /> {isCvUploading ? "Uploading..." : "Upload PDF"}
                </button>
              )}
            </div>
          </div>

          {!cvFile && (
            <div
              onClick={() => cvInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-10 text-center text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
            >
              <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-base font-medium">Click to upload your latest resume</p>
              <p className="text-sm mt-1 opacity-70">Supported format: PDF (Max 10MB)</p>
            </div>
          )}
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-gradient-card rounded-xl border border-border p-6 mb-8"
          >
            <h3 className="font-display font-semibold text-lg mb-6">
              {editingId ? "Edit Project" : "New Project"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Title", name: "title" },
                { label: "Description", name: "description" },
                { label: "Problem", name: "problem" },
                { label: "Solution", name: "solution" },
                { label: "Tools (comma-separated)", name: "tools" },
                { label: "Features (comma-separated)", name: "features" },
                { label: "GitHub URL", name: "githubUrl" },
                { label: "Live URL", name: "liveUrl" },
                { label: "Behance URL", name: "behanceUrl" }
              ].map((field) => (
                <div key={field.name} className={["description", "problem", "solution", "features"].includes(field.name) ? "sm:col-span-2" : ""}>
                  <label className="text-sm font-medium text-foreground block mb-1.5">{field.label}</label>
                  {["description", "problem", "solution", "features"].includes(field.name) ? (
                    <textarea
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder={field.label}
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={(formData as any)[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}

              <div className="sm:col-span-2 flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-border text-accent focus:ring-accent bg-secondary cursor-pointer"
                />
                <div>
                  <label htmlFor="featured" className="text-sm font-semibold text-foreground cursor-pointer block select-none">
                    Featured Project
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Highlight this project at the top of your portfolio.
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1.5">Thumbnail</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {formData.thumbnail ? (
                  <div className="relative group rounded-lg overflow-hidden border border-border aspect-video max-w-xs mb-2">
                    <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer mb-2"
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-medium">Main Thumbnail</p>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground block">Gallery Images (Slider)</label>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    {galleryFiles.length} / 8 Images
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={galleryFiles.length >= 8}
                  accept="image/*"
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 mb-4 disabled:opacity-50"
                />
                <p className="text-[10px] text-muted-foreground mb-4">
                  * Max 8 images. Each slide can have a title and caption. Keep each under 2MB.
                </p>
                
                {galleryFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {galleryFiles.map((file, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden border border-border group aspect-video">
                          <img src={file} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => {
                              setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
                              setGalleryFileObjects(prev => prev.filter((_, i) => i !== idx));
                              setGalleryTitles(prev => prev.filter((_, i) => i !== idx));
                              setGalleryDescriptions(prev => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 p-1 bg-destructive/80 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                          <div className="absolute bottom-1 left-1 text-[8px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">
                            {idx + 1}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={galleryTitles[idx] || ""}
                          onChange={(e) => {
                            const t = [...galleryTitles]; t[idx] = e.target.value; setGalleryTitles(t);
                          }}
                          placeholder="Slide title..."
                          className="w-full px-2 py-1 text-xs bg-secondary border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                        <input
                          type="text"
                          value={galleryDescriptions[idx] || ""}
                          onChange={(e) => {
                            const d = [...galleryDescriptions]; d[idx] = e.target.value; setGalleryDescriptions(d);
                          }}
                          placeholder="Caption (optional)"
                          className="w-full px-2 py-1 text-xs bg-secondary border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground block">Project Impact Metrics</label>
                  <button
                    type="button"
                    onClick={() => setMetrics([...metrics, { 
                      label: "", 
                      value: "", 
                      description: "", 
                      beforeImages: [], 
                      afterImages: [], 
                      beforeFiles: [null, null], 
                      afterFiles: [null, null] 
                    }])}
                    className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-md hover:bg-primary/20 transition-colors"
                  >
                    + Add Metric
                  </button>
                </div>
                {metrics.map((metric, idx) => (
                  <div key={idx} className="space-y-4 p-4 bg-secondary/50 border border-border rounded-xl relative group/metric">
                    <button
                      type="button"
                      onClick={() => setMetrics(metrics.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover/metric:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-muted-foreground font-bold mb-1 block">Label</label>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => {
                            const newMetrics = [...metrics];
                            newMetrics[idx].label = e.target.value;
                            setMetrics(newMetrics);
                          }}
                          className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                          placeholder="e.g. Performance"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-muted-foreground font-bold mb-1 block">Value</label>
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => {
                            const newMetrics = [...metrics];
                            newMetrics[idx].value = e.target.value;
                            setMetrics(newMetrics);
                          }}
                          className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                          placeholder="e.g. +45%"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-muted-foreground font-bold mb-1 block">Description</label>
                      <textarea
                        value={metric.description}
                        onChange={(e) => {
                          const newMetrics = [...metrics];
                          newMetrics[idx].description = e.target.value;
                          setMetrics(newMetrics);
                        }}
                        className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                        rows={2}
                        placeholder="Explain the impact..."
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      {/* Before Images */}
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase text-muted-foreground font-bold block">Before Photos (1-2)</label>
                        <div className="flex flex-wrap gap-3">
                          {[0, 1].map((i) => (
                            <div key={i} className="flex-1 min-w-[120px]">
                              {(metric.beforeFiles[i] || metric.beforeImages[i]) ? (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                  <img 
                                    src={metric.beforeFiles[i] ? URL.createObjectURL(metric.beforeFiles[i]!) : metric.beforeImages[i]} 
                                    className="w-full h-full object-cover" 
                                  />
                                  <button 
                                    onClick={() => {
                                      const newMetrics = [...metrics];
                                      newMetrics[idx].beforeFiles[i] = null;
                                      newMetrics[idx].beforeImages = newMetrics[idx].beforeImages.filter((_, idx) => idx !== i);
                                      setMetrics(newMetrics);
                                    }}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const newMetrics = [...metrics];
                                      newMetrics[idx].beforeFiles[i] = file;
                                      setMetrics(newMetrics);
                                    }
                                  }}
                                  className="w-full text-[10px] text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* After Images */}
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase text-muted-foreground font-bold block">After Photos (1-2)</label>
                        <div className="flex flex-wrap gap-3">
                          {[0, 1].map((i) => (
                            <div key={i} className="flex-1 min-w-[120px]">
                              {(metric.afterFiles[i] || metric.afterImages[i]) ? (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                                  <img 
                                    src={metric.afterFiles[i] ? URL.createObjectURL(metric.afterFiles[i]!) : metric.afterImages[i]} 
                                    className="w-full h-full object-cover" 
                                  />
                                  <button 
                                    onClick={() => {
                                      const newMetrics = [...metrics];
                                      newMetrics[idx].afterFiles[i] = null;
                                      newMetrics[idx].afterImages = newMetrics[idx].afterImages.filter((_, idx) => idx !== i);
                                      setMetrics(newMetrics);
                                    }}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const newMetrics = [...metrics];
                                      newMetrics[idx].afterFiles[i] = file;
                                      setMetrics(newMetrics);
                                    }
                                  }}
                                  className="w-full text-[10px] text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="bg-gradient-gold text-primary-foreground font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Save Project"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    description: "",
                    problem: "",
                    solution: "",
                    tools: "",
                    tags: "",
                    githubUrl: "",
                    liveUrl: "",
                    behanceUrl: "",
                    thumbnail: ""
                  });
                  setGalleryFiles([]);
                  setGalleryFileObjects([]);
                  setThumbnailFile(null);
                }}
                className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Projects Table */}
        <div className="bg-gradient-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Project</th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Order</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden sm:table-cell">Tools</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell">Featured</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {projectList.map((project) => {
                    const isStatic = projects.some(p => p.id === project.id);
                    return (
                      <tr key={project.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={project.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-medium text-foreground">{project.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleMoveUp(projectList.indexOf(project))}
                              disabled={projectList.indexOf(project) === 0}
                              className="p-1 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveDown(projectList.indexOf(project))}
                              disabled={projectList.indexOf(project) === projectList.length - 1}
                              className="p-1 text-muted-foreground hover:text-primary disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="flex gap-1 flex-wrap max-w-[200px]">
                            {project.tools.slice(0, 3).map((tool) => (
                              <span key={tool} className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border">{tool}</span>
                            ))}
                            {project.tools.length > 3 && <span className="text-[10px] text-muted-foreground">+{project.tools.length - 3} more</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className={`text-xs px-2 py-1 rounded-full ${project.featured ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                            {project.featured ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/project/${project.id}`} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => copyProjectCode(project)}
                              className="p-2 text-muted-foreground hover:text-accent transition-colors"
                              title="Copy Code Snippet"
                            >
                              <Code className="w-4 h-4" />
                            </button>
                            {!isStatic && (
                              <>
                                <button 
                                  onClick={() => handleEdit(project)}
                                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                  title="Edit Project"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
