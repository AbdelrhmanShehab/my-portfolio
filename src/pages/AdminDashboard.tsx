import { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Upload, X, ChevronUp, ChevronDown, Download, Code, Copy, Check } from "lucide-react";
import { projects, type Project, getProjectList, saveProject, deleteProject, reorderProjects } from "@/data/projects";
import { Link } from "react-router-dom";
import { toast } from "sonner";
const AdminDashboard = () => {
  const [galleryFiles, setGalleryFiles] = useState<string[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);
  
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
    tags: "",
    githubUrl: "",
    liveUrl: "",
    behanceUrl: "",
    thumbnail: ""
  });
  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 6 - galleryFiles.length;

    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s) to the gallery (Max 6)`);
      return;
    }

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`"${file.name}" is too large. Please keep images under 2MB for better performance.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryFiles((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, thumbnail: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.thumbnail) {
      toast.error("Please fill in the title, description, and upload a thumbnail");
      return;
    }

    const newProject: Project = {
      id: editingId || formData.title.toLowerCase().replace(/\s+/g, "-"),
      title: formData.title,
      description: formData.description,
      problem: formData.problem,
      solution: formData.solution,
      tools: formData.tools.split(",").map(t => t.trim()).filter(t => t),
      tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
      thumbnail: formData.thumbnail,
      gallery: galleryFiles.length > 0 ? galleryFiles : [formData.thumbnail],
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      behanceUrl: formData.behanceUrl,
      featured: false
    };

    try {
      await saveProject(newProject);
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
      toast.success(editingId ? "Project updated!" : "Project added successfully!");
      setGalleryFiles([]);
      setEditingId(null);
      setShowForm(false);
      const list = await getProjectList();
      setProjectList(list);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save project");
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      problem: project.problem,
      solution: project.solution,
      tools: project.tools.join(", "),
      tags: project.tags.join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      behanceUrl: project.behanceUrl || "",
      thumbnail: project.thumbnail
    });
    setGalleryFiles(project.gallery || []);
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

  const handleCvUpload = (e: ChangeEvent<HTMLInputElement>) => {
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

      // In a real app, you'd upload to a server. 
      const mockUrl = URL.createObjectURL(file);
      const metadata = { name: file.name, url: mockUrl };
      setCvFile(metadata);
      localStorage.setItem("cv_metadata", JSON.stringify(metadata));
      toast.success("CV uploaded successfully!");
    }
  };

  const removeCv = () => {
    setCvFile(null);
    localStorage.removeItem("cv_metadata");
    if (cvInputRef.current) cvInputRef.current.value = "";
    toast.success("CV removed");
  };

  const getExportCode = () => {
    const code = `export const projects: Project[] = ${JSON.stringify(projectList, null, 2)};`;
    return code;
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
                <p className="text-muted-foreground text-sm">Copy this code and paste it into <code className="text-primary">src/data/projects.ts</code> to make your projects permanent.</p>
              </div>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg transition-all border border-accent/20"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            
            <div className="relative">
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-[13px] text-blue-300 font-mono max-h-[300px] border border-white/5">
                {getExportCode()}
              </pre>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#1A1C23] to-transparent pointer-events-none" />
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                <strong>Why is this needed?</strong> Projects added via this dashboard are stored in your browser only. 
                To show them on the deployed site for everyone, you must "bake" them into the source code by updating the 
                <code className="mx-1 px-1 bg-primary/20 rounded text-primary">projects</code> array in 
                <code className="mx-1 px-1 bg-primary/20 rounded text-primary">src/data/projects.ts</code>.
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
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-medium px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <Upload className="w-4 h-4" /> Upload PDF
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
                { label: "GitHub URL", name: "githubUrl" },
                { label: "Live URL", name: "liveUrl" },
                { label: "Behance URL", name: "behanceUrl" }
              ].map((field) => (
                <div key={field.name} className={["description", "problem", "solution"].includes(field.name) ? "sm:col-span-2" : ""}>
                  <label className="text-sm font-medium text-foreground block mb-1.5">{field.label}</label>
                  {["description", "problem", "solution"].includes(field.name) ? (
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
                    {galleryFiles.length} / 6 Images
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={galleryFiles.length >= 6}
                  accept="image/*"
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 mb-4 disabled:opacity-50"
                />
                <p className="text-[10px] text-muted-foreground mb-4">
                  * Max 6 images. Keep each under 2MB to avoid storage limits.
                </p>
                
                {galleryFiles.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {galleryFiles.map((file, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                        <img src={file} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setGalleryFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-destructive/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-gradient-gold text-primary-foreground font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Save Project
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
                            {!isStatic && (
                              <>
                                <button 
                                  onClick={() => handleEdit(project)}
                                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(project.id)}
                                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
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
