import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Palette, Code2, Rocket, MessageSquare, ShieldCheck, CheckCircle2, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const skills = [
  {
    title: "UI/UX Design",
    label: "UX OPTIMIZED",
    description:
      "Designing user-centered digital experiences that combine usability, aesthetics, and business strategy through real-world UX processes and product thinking.",
    icon: <Palette className="w-6 h-6" />,
    color: "from-blue-500/20 to-cyan-500/20",
    glow: "bg-blue-500/10",
    evidence: [
      "Link Development UX Internship",
      "Real UX Workflow Participation",
      "User Flow Optimization",
      "Full UX Case Studies",
      "Hedoomyy UX System",
      "Local Leaks UX Design",
      "InFlow Product Experience",
      "FlatFit Mobile UX"
    ]
  },

  {
    title: "Software Engineering",
    label: "SYSTEM ACHIEVEMENTS",
    description:
      "Building scalable production-level web systems with modern frontend technologies, business-driven architecture, and real-world operational logic.",
    icon: <Code2 className="w-6 h-6" />,
    color: "from-purple-500/20 to-pink-500/20",
    glow: "bg-purple-500/10",
    evidence: [
      "Production Web Applications",
      "560+ Employee Management Systems",
      "Evaluation & Training Platforms",
      "Real HR Operational Systems",
      "Frontend Architecture",
      "Business Logic Engineering",
      "Deployment & Production",
      "Performance & Requests  Optimization"
    ]
  },

  {
    title: "Product Thinking",
    label: "PRODUCT ENGINEERING LOGS",
    description:
      "Connecting business goals, user needs, and technical execution to build products that create measurable real-world value.",
    icon: <Rocket className="w-6 h-6" />,
    color: "from-orange-500/20 to-red-500/20",
    glow: "bg-orange-500/10",
    evidence: [
      "Business Requirement Translation",
      "Real Business Problem Solving",
      "UX + Business Alignment",
      "Product Strategy Thinking",
      "Workflow Optimization",
      "Value-Driven Decisions",
      "Scalable System Planning",
      "Feature Prioritization"
    ]
  },

  {
    title: "Client Communication",
    label: "REAL CLIENT INTERACTION",
    description:
      "Leading communication between stakeholders, users, and development teams to transform business requirements into successful digital products.",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-green-500/20 to-emerald-500/20",
    glow: "bg-green-500/10",
    evidence: [
      "Real Client Graduation Project",
      "Main Client Communication Point",
      "Offline Requirement Meetings",
      "Team Leadership",
      "Requirement Analysis and Translation",
      "Cross-Team Collaboration",
      "Development Participation"
    ]
  },

  {
    title: "Cybersecurity Awareness",
    label: "SECURITY AWARE",
    description:
      "Applying security-first thinking during product development to build safer, more reliable, and trustworthy digital systems.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "from-indigo-500/20 to-blue-600/20",
    glow: "bg-indigo-500/10",
    evidence: [
      "CompTIA Security+ In Progress",
      "Web Security Awareness",
      "3A Concepts",
      "Secure Product Thinking",
      "Security-Focused Architecture",
      "Common Vulnerability Awareness",
      "Frontend Security Practices"
    ]
  },
];


const EvidenceItem = ({ text, index }: { text: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
  >
    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
    </div>
    <span className="text-[11px] font-mono tracking-wider text-muted-foreground group-hover:text-foreground/90 transition-colors">
      {text.toUpperCase()}
    </span>
    <CheckCircle2 className="ml-auto w-3 h-3 text-accent/40 group-hover:text-accent transition-colors" />
  </motion.div>
);

const SkillCard = ({ skill, index, isMobile = false }: { skill: typeof skills[0]; index: number; isMobile?: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    if (!isMobile) setIsExpanded(false);
  };

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(var(--accent-rgb, 255, 115, 68), 0.08), transparent 80%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-accent/30 ${isMobile ? 'min-w-[85vw] sm:min-w-0' : ''}`}
    >
      {/* VERIFIED Badge */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <span className="text-[10px] font-bold tracking-[0.2em] text-accent/60 group-hover:text-accent transition-colors">
          VERIFIED
        </span>
        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(255,115,68,0.5)]" />
      </div>

      {/* Spotlight Effect (Desktop) */}
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300"
          style={{ background }}
        />
      )}

      {/* Glow Background */}
      <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 ${skill.glow}`} />

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${skill.color} border border-white/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
          <div className="text-foreground group-hover:text-accent transition-colors duration-300">
            {skill.icon}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-[0.3em] text-accent font-bold opacity-80">
            {skill.label}
          </span>
          <h3 className="text-2xl font-display font-medium tracking-tight group-hover:text-accent transition-colors duration-300">
            {skill.title}
          </h3>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors duration-300 mb-8 max-w-[90%]">
        {skill.description}
      </p>

      {/* Evidence System Panel */}
      <div className="relative z-10 space-y-2 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground group-hover:text-accent/80 transition-colors">
            SYSTEM EVIDENCE LOGS
          </span>
          <Zap className="w-3 h-3 text-accent group-hover:animate-bounce" />
        </div>

        <div className="space-y-1">
          {skill.evidence.map((text, i) => (
            <EvidenceItem key={i} text={text} index={i} />
          ))}
        </div>
      </div>

      {/* Mission Footer */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-accent"
            />
          </div>
          <span className="text-[9px] font-mono text-muted-foreground">MISSION COMPLETED</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-500 group-hover:w-full shadow-[0_0_10px_rgba(255,115,68,0.5)]" />
    </motion.div>
  );
};

const ProductSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-24 sm:py-32 overflow-hidden flex flex-col justify-center bg-background"
    >
      {/* Background Parallax Glows */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-accent/5 blur-[140px] rounded-full pointer-events-none"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6 justify-center">
              <div className="h-px w-12 bg-accent/40" />
              <p className="text-accent text-xs font-bold tracking-[0.4em] uppercase">
                System Evidence
              </p>
              <div className="h-px w-12 bg-accent/40" />
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display leading-[1.1] tracking-tight mb-8">
              Building <span className="italic text-accent">Products</span>, <br className="hidden sm:block" />
              Not Just Interfaces
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            A product-oriented engineer who combines <span className="text-foreground font-medium">design</span>,
            <span className="text-foreground font-medium"> business understanding</span>,
            <span className="text-foreground font-medium"> communication</span>,
            <span className="text-foreground font-medium"> frontend engineering</span>, and
            <span className="text-foreground font-medium"> security awareness</span>.
            I don't just ship code; I ship solutions that scale and secure your vision.
          </motion.p>
        </div>

        {/* Evidence System Carousel/Grid */}
        {isMobile ? (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {skills.map((skill, i) => (
                <div key={skill.title} className="snap-center">
                  <SkillCard skill={skill} index={i} isMobile={true} />
                </div>
              ))}
            </div>
            {/* Mobile Scroll Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {skills.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent/20" />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {skills.slice(0, 3).map((skill, i) => (
              <SkillCard key={skill.title} skill={skill} index={i} />
            ))}
            <div className="lg:col-span-3 grid md:grid-cols-2 gap-6 lg:gap-8 lg:max-w-[68%] lg:mx-auto">
              {skills.slice(3).map((skill, i) => (
                <SkillCard key={skill.title} skill={skill} index={i + 3} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Achievement Label */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-[0.5em] text-accent/20 whitespace-nowrap hidden sm:block">
        VERIFIED PRODUCT ENGINEERING SYSTEM V2.0
      </div>
    </section>
  );
};

export default ProductSection;
