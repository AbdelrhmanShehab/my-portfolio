import { motion } from "framer-motion";
import { ArrowDown, MapPin, Download, ArrowUpRight, Github, Linkedin, ExternalLink } from "lucide-react";
import abdelrhmanPhoto from "@/assets/abdelrhman.jpg";
import { useState, useEffect } from "react";
import ParticlesCanvas from "./ParticlesCanvas";
import { useXP } from "./XPSystem";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

// Custom Behance Icon
const BehanceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12h2a2 2 0 1 0 0-4H9v4z" />
    <path d="M9 16h3a2 2 0 1 0 0-4H9v4z" />
    <path d="M17 12h3" />
    <path d="M17 15h3" />
    <path d="M17 9h3" />
    <rect x="2" y="3" width="20" height="18" rx="4" />
  </svg>
);

const socialLinks = [
  {
    name: "GitHub",
    icon: <Github className="w-5 h-5" />,
    url: "https://github.com/AbdelrhmanShehab",
    color: "hover:text-[#2dba4e]"
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-5 h-5" />,
    url: "www.linkedin.com/in/abdelrhman-shihab-372bb2228",
    color: "hover:text-[#0077b5]"
  },
  {
    name: "Behance",
    icon: <BehanceIcon className="w-5 h-5" />,
    url: "https://www.behance.net/abdelrhmanhossam",
    color: "hover:text-[#053eff]"
  }
];

const skills = ["React.js", "Next.js", "TypeScript", "UX Design", "SQL"];

const stats = [
  { value: "5+", label: "Full systems shipped" },
  { value: "1+", label: "Years experience" },
  { value: "~30%", label: "Avg. perf. gains" },
];

const HeroSection = () => {
  const [cvUrl, setCvUrl] = useState("/cv.pdf");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { gainXP } = useXP();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cv_metadata");
    if (saved) {
      try {
        const { url } = JSON.parse(saved);
        if (url) setCvUrl(url);
      } catch (error) {
        console.error("Failed to parse CV metadata", error);
      }
    }
  }, []);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 30;
    const y = (e.clientY / innerHeight - 0.5) * 30;
    setMouse({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* Depth Layer 1 (slow background) */}
      <ParticlesCanvas speed={0.4} opacity={0.2} />

      {/* Depth Layer 2 (interactive foreground) */}
      <ParticlesCanvas speed={1} opacity={0.5} />
      {/* 🌌 Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-accent/20 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full bottom-[-100px] right-[-100px] animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-px w-16 bg-accent origin-left mb-8"
        />

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          {/* LEFT */}
          <motion.div
            style={{
              transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)`
            }}
          >
            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-8"
            >
              <MapPin className="w-3.5 h-3.5" />
              Cairo, Egypt
            </motion.div>

            {/* Title */}
            <motion.h1
              initial="hidden"
              animate="visible"
              className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-8"
            >
              {"I don't just write code — I mind the business behind it.".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className={word.toLowerCase() === "business" ? "italic text-accent inline-block mr-3" : "inline-block mr-3"}
                >
                  {word}
                  {/* Manually handle line breaks if needed, but word wrapping is usually better for responsiveness */}
                  {(word === "write" || word === "the") && <br className="hidden lg:block" />}
                </motion.span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              I'm <span className="text-foreground font-medium">Abdelrhman Shihab</span> — a software engineer who bridges business
              requirements and clean code. I build fast, scalable React &
              Next.js systems that actually solve real problems.
            </motion.p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                {
                  label: "View My Work",
                  icon: <ArrowUpRight className="w-4 h-4" />,
                  href: "#projects",
                  primary: true,
                },
                {
                  label: "Download CV",
                  icon: <Download className="w-4 h-4" />,
                  href: cvUrl,
                },
              ].map((btn, i) => (
                <motion.a
                  key={i}
                  href={btn.label.includes("Download") ? "/resume" : btn.href}
                  onClick={(e) => {
                    if (btn.label.includes("Download")) {
                      e.preventDefault();
                      gainXP(15, e.clientX, e.clientY);
                      trackEvent("button_click", { name: "go_to_resume" });
                      navigate("/resume");
                    } else {
                      trackEvent("button_click", { name: "view_my_work", destination: "#projects" });
                      gainXP(5, e.clientX, e.clientY);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all duration-300 ${btn.primary
                    ? "bg-foreground text-background border-foreground hover:shadow-glow"
                    : "border-border hover:bg-accent hover:text-accent-foreground hover:border-accent"
                    }`}
                >
                  {btn.label.includes("Download") ? "Go to Resume" : btn.label}
                </motion.a>
              ))}
            </div>

            {/* Social Links - Catchy Floating Badge Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12 ml-2">
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + (i * 0.1), type: "spring", stiffness: 100 }}
                  onClick={() => {
                    trackEvent("link_click", { platform: link.name, url: link.url });
                  }}
                  whileHover={{
                    y: -5,
                    scale: 1.05,
                    boxShadow: link.name === "GitHub"
                      ? "0 10px 25px -5px rgba(45, 186, 78, 0.4), 0 0 15px rgba(45, 186, 78, 0.2)"
                      : link.name === "LinkedIn"
                        ? "0 10px 25px -5px rgba(0, 119, 181, 0.4), 0 0 15px rgba(0, 119, 181, 0.2)"
                        : "0 10px 25px -5px rgba(5, 62, 255, 0.4), 0 0 15px rgba(5, 62, 255, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group overflow-hidden flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md transition-all duration-300 cursor-pointer"
                >
                  {/* Branding Color Background Slide */}
                  <span className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r ${link.name === "GitHub" ? "from-[#2dba4e] to-emerald-400" :
                      link.name === "LinkedIn" ? "from-[#0077b5] to-blue-400" :
                        "from-[#053eff] to-indigo-500"
                    }`} />

                  {/* Icon */}
                  <span className={`transition-all duration-300 ${link.name === "GitHub" ? "group-hover:text-[#2dba4e] group-hover:scale-110" :
                      link.name === "LinkedIn" ? "group-hover:text-[#0077b5] group-hover:scale-110" :
                        "group-hover:text-[#053eff] group-hover:scale-110"
                    } text-muted-foreground`}>
                    {link.icon}
                  </span>

                  {/* Name Label */}
                  <span className="font-mono text-xs tracking-wider font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {link.name.toUpperCase()}
                  </span>

                  {/* Tiny Arrow */}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-muted-foreground group-hover:text-accent" />
                </motion.a>
              ))}
            </div>

            {/* Stats */}
            <div className="border-t border-border/60 pt-8">
              <div className="grid grid-cols-3 gap-6 max-w-md">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  >
                    <div className="text-3xl font-display text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            style={{
              transform: `translate(${mouse.x * -0.6}px, ${mouse.y * -0.6}px)`
            }}
            className="flex flex-col items-center lg:items-end"
          >
            {/* Image */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: -1 }}
              className="relative group"
            >
              <div className="absolute -inset-6 bg-accent/20 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700" />

              <div className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border border-border/40">
                <img
                  src={abdelrhmanPhoto}
                  alt="Abdelrhman"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
            </motion.div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-6 max-w-[450px] justify-center lg:justify-end">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  whileHover={{ y: -4, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent "
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;