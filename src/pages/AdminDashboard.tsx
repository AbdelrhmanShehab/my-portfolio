import { useState, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Upload, X } from "lucide-react";
import { projects, type Project, getProjectList, saveProject, deleteProject } from "@/data/projects";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [projectList, setProjectList] = useState<Project[]>(() => getProjectList());
  const [showForm, setShowForm] = useState(false);
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

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.thumbnail) {
      toast.error("Please fill in the title, description, and upload a thumbnail");
      return;
    }

    const newProject: Project = {
      id: formData.title.toLowerCase().replace(/\s+/g, "-"),
      title: formData.title,
      description: formData.description,
      problem: formData.problem,
      solution: formData.solution,
      tools: formData.tools.split(",").map(t => t.trim()).filter(t => t),
      tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
      thumbnail: formData.thumbnail,
      gallery: [formData.thumbnail],
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      behanceUrl: formData.behanceUrl,
      featured: false
    };

    saveProject(newProject);
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
    toast.success("Project added successfully!");

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjectList(getProjectList());
    toast.success("Project deleted");
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
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

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
            <h3 className="font-display font-semibold text-lg mb-6">New Project</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Title", name: "title" },
                { label: "Description", name: "description" },
                { label: "Problem", name: "problem" },
                { label: "Solution", name: "solution" },
                { label: "Tools (comma-separated)", name: "tools" },
                { label: "Tags (comma-separated)", name: "tags" },
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
                  <div className="relative group rounded-lg overflow-hidden border border-border aspect-video max-w-sm">
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
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
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
                onClick={() => setShowForm(false)}
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
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden sm:table-cell">Tags</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell">Featured</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectList.map((project) => (
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
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex gap-1">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{tag}</span>
                        ))}
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
                        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
