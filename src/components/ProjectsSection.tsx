import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { projects, getAllTools, getProjectList, type Project } from "@/data/projects";

const ProjectsSection = () => {
  const [allTools, setAllTools] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [projectList, setProjectList] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [list, tools] = await Promise.all([getProjectList(), getAllTools()]);
      setProjectList(list);
      setAllTools(tools);
    };
    fetchData();
  }, []);

  const filtered = activeTool
    ? projectList.filter((p) => p.tools.includes(activeTool))
    : projectList;

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4">
            Selected Work
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display tracking-tight">
            Recent <span className="italic text-accent">projects</span>
          </h2>
        </motion.div>

        {/* Tool Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          <button
            onClick={() => setActiveTool(null)}
            className={`px-6 py-2.5 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 border ${
              activeTool === null
                ? "bg-accent text-accent-foreground border-accent shadow-glow-sm scale-105"
                : "bg-[#1A1C23] text-muted-foreground border-white/5 hover:border-accent/40 hover:text-accent hover:bg-accent/5"
            }`}
          >
            All
          </button>
          {allTools.map((tool) => (
            <button
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`px-6 py-2.5 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 border ${
                activeTool === tool
                  ? "bg-accent text-accent-foreground border-accent shadow-glow-sm scale-105"
                  : "bg-[#1A1C23] text-muted-foreground border-white/5 hover:border-accent/40 hover:text-accent hover:bg-accent/5"
              }`}
            >
              {tool}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
