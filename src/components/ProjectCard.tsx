import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import type { Project } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 🎯 3D Tilt Logic using Framer Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    setActiveIndex(0);
  };

  // 🎞️ Automatic Slider Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && project.gallery && project.gallery.length > 1) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % project.gallery.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isHovered, project.gallery]);

  const images = project.gallery && project.gallery.length > 0 ? project.gallery : [project.thumbnail];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="perspective-1000"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative h-full"
      >
        {/* Deep Glow Effect */}
        <div className="absolute -inset-4 bg-accent/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

        <Link
          to={`/project/${project.id}`}
          className="relative block h-full bg-card/30 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 overflow-hidden transition-colors duration-500 group-hover:border-accent/40 group-hover:bg-card/50"
        >
          {/* 🎞️ IMAGE SLIDER SECTION */}
          <div className="relative aspect-[10/11] rounded-2xl overflow-hidden mb-6 bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={isHovered ? activeIndex : "thumbnail"}
                src={isHovered ? images[activeIndex] : project.thumbnail}
                alt={project.title}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Premium Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />

            {/* Slider Progress Indicator */}
            {isHovered && images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-1.5 z-20">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: i === activeIndex ? "100%" : i < activeIndex ? "100%" : "0%" 
                      }}
                      transition={{ duration: i === activeIndex ? 2 : 0.3 }}
                      className="h-full bg-accent"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Project Quick View Button */}
            <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div style={{ transform: "translateZ(30px)" }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md bg-accent/10 text-accent border border-accent/20"
                >
                  {tool}
                </span>
              ))}
            </div>

            <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6 group-hover:text-foreground/80 transition-colors duration-300">
              {project.description}
            </p>

            <div className="flex items-center text-xs font-semibold text-accent/80 group-hover:text-accent transition-colors">
              <span className="mr-2">Explore Project</span>
              <div className="h-px flex-1 bg-accent/20 group-hover:bg-accent/40 transition-colors" />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;