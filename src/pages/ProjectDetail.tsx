import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProject } from "@/data/projects";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = getProject(id || "");

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container px-6">
          {/* Back link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {project.description}
            </p>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl overflow-hidden border border-border mb-16"
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Case Study Grid */}
          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-display font-semibold mb-4 text-primary">The Challenge</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">{project.problem}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-display font-semibold mb-4 text-primary">The Solution</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">{project.solution}</p>
              </motion.div>

              {/* Gallery */}
              {project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-display font-semibold mb-6 text-primary">Gallery</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-border">
                        <img src={img} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Tools */}
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">Tools Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span key={tool} className="text-sm px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="bg-gradient-card rounded-xl border border-border p-6 space-y-3">
                <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">Links</h3>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Github className="w-4 h-4" /> GitHub Repo
                  </a>
                )}
                {project.behanceUrl && (
                  <a href={project.behanceUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                    <Palette className="w-4 h-4" /> Behance
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
