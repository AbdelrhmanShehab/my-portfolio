import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative cursor-pointer"
    >
      {/* Subtle hover glow */}
      <div className="absolute -inset-px rounded-2xl bg-accent/0 group-hover:bg-accent/10 blur-md transition-all duration-500" />

      <Link
        to={`/project/${project.id}`}
        className="relative block bg-card/40 p-5 rounded-2xl border border-border/60 backdrop-blur-sm transition-all duration-500 group-hover:border-accent/60 group-hover:-translate-y-1"
      >
        <div className="mb-5 overflow-hidden rounded-xl aspect-square bg-muted">
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            width={600}
            height={600}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <h3 className="font-display text-2xl tracking-tight mb-2 text-foreground">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/60 text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
