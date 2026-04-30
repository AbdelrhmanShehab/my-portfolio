import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProject } from "@/data/projects";

import { useState, useEffect } from "react";
import type { Project } from "@/data/projects";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleNext = () => {
    if (project?.gallery && currentSlide < project.gallery.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500;
    if (offset.x < -100 || (swipe && offset.x < 0)) {
      handleNext();
    } else if (offset.x > 100 || (swipe && offset.x > 0)) {
      handlePrev();
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const data = await getProject(id || "");
      setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              {project.tools.slice(0, 3).map((tool) => (
                <span key={tool} className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {tool}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
              {project.description}
            </p>

            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold text-lg shadow-glow hover:shadow-glow/80 transition-all"
              >
                Visit Live Demo
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            )}
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-16 relative group"
          >
            <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <img
              src={project.thumbnail}
              alt={project.title}
              width={1200}
              height={675}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
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
                <h2 className="text-2xl font-display font-bold mb-4 text-foreground flex items-center gap-3">
                  <span className="w-8 h-px bg-accent" />
                  The Challenge
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{project.problem}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-display font-bold mb-4 text-foreground flex items-center gap-3">
                  <span className="w-8 h-px bg-accent" />
                  The Solution
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{project.solution}</p>
              </motion.div>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-display font-bold mb-6 text-foreground flex items-center gap-3">
                    <span className="w-8 h-px bg-accent" />
                    Gallery
                  </h2>
                  
                  <div className="relative group/slider overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-card/20">
                    <motion.div 
                      className="flex cursor-grab active:cursor-grabbing"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={handleDragEnd}
                      animate={{ x: `-${currentSlide * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {project.gallery.map((img, i) => (
                        <div key={i} className="min-w-full px-4">
                          <img 
                            src={img} 
                            alt={`${project.title} screenshot ${i + 1}`} 
                            loading="lazy" 
                            onClick={() => setSelectedImage(img)}
                            className="w-full h-auto object-cover rounded-xl aspect-[16/9] cursor-zoom-in" 
                          />
                        </div>
                      ))}
                    </motion.div>

                    {/* Navigation Buttons */}
                    {project.gallery.length > 1 && (
                      <>
                        <div className="absolute inset-y-0 left-0 flex items-center p-4">
                          <button 
                            onClick={handlePrev}
                            disabled={currentSlide === 0}
                            className="w-12 h-12 rounded-full bg-background/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-0 shadow-lg z-30"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center p-4">
                          <button 
                            onClick={handleNext}
                            disabled={currentSlide === (project.gallery?.length || 1) - 1}
                            className="w-12 h-12 rounded-full bg-background/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-0 shadow-lg z-30"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </div>
                      </>
                    )}

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.gallery.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`w-2 h-2 rounded-full transition-all ${currentSlide === i ? "bg-accent w-6" : "bg-white/40 hover:bg-white/60"}`}
                        />
                      ))}
                    </div>
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
              <div className="bg-card/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-xl">
                <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span key={tool} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary/80 text-secondary-foreground border border-white/5">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Links */}
              <div className="bg-card/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-xl">
                <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Project Links</h3>
                <div className="flex flex-col gap-4">
                  {project.liveUrl && (
                    <motion.a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="group flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent font-bold transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="flex items-center gap-3">
                        <ExternalLink className="w-5 h-5" />
                        Live Preview
                      </span>
                      <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  )}
                  {project.githubUrl && (
                    <motion.a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-foreground font-bold transition-all hover:bg-white hover:text-background"
                    >
                      <span className="flex items-center gap-3">
                        <Github className="w-5 h-5" />
                        Source Code
                      </span>
                      <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  )}
                  {project.behanceUrl && (
                    <motion.a 
                      href={project.behanceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="group flex items-center justify-between p-4 rounded-xl bg-[#0057ff]/10 border border-[#0057ff]/20 text-[#0057ff] font-bold transition-all hover:bg-[#0057ff] hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <Palette className="w-5 h-5" />
                        Behance
                      </span>
                      <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center"
            >
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-accent transition-colors flex items-center gap-2 font-display text-sm uppercase tracking-widest"
              >
                Close <span className="text-2xl">&times;</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
