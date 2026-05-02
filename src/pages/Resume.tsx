import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import {
  MapPin, Mail, Phone, Github, Linkedin, GraduationCap,
  Briefcase, Code2, Palette, Wrench, Award, ExternalLink,
  ChevronRight, Cpu, Shield, Download, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ParticlesCanvas from "@/components/ParticlesCanvas";
import InteractiveGlow from "@/components/InteractiveGlow";
import Magnetic from "@/components/Magnetic";
import { XPProvider, useXP } from "@/components/XPSystem";

// ─── Data ────────────────────────────────────────────────────────────────────

const experience = [
  {
    title: "Software Engineer",
    company: "Governmental Institute",
    period: "Sep 2025 – Present",
    type: "Full-time",
    color: "accent",
    bullets: [
      "Developed and maintained multiple C# desktop and Next.js web applications integrated with SQL Server",
      "HR Management System with fingerprint attendance & automated payroll",
      "Employee Evaluation & Training Platform with performance dashboards",
      "IT Ticketing System, Restaurant POS System, Gym & Sports Reservation System",
      "Continuously adapting features based on user needs and stakeholder feedback",
    ],
  },
  {
    title: "Software Engineer Intern",
    company: "Mevac Company",
    period: "Jul 2025 – Sep 2025",
    type: "Internship",
    color: "blue",
    bullets: [
      "Automated IT request workflows using Power Automate, Power Apps, and SharePoint",
      "Generated dynamic HTML archive documents for record-keeping",
      "Developed a secure internal React.js website integrated with DNS/DHCP",
      "Gained hands-on experience in networking and system fundamentals",
    ],
  },
  {
    title: "UX Designer Intern",
    company: "Link Development",
    period: "Jul 2022 – Sep 2022",
    type: "Internship",
    color: "purple",
    bullets: [
      "Handled the full UI/UX design process, from brainstorming to wireframes to final designs",
      "Joined daily scrum meetings and learned Agile workflows",
    ],
  },
];

const projects = [
  {
    name: "Hedoomyy E-commerce Platform",
    tech: ["Next.js", "Firebase", "Tailwind CSS", "Nodemailer"],
    description: "Full-stack e-commerce with admin dashboard, revenue tracking, RBAC, real-time notifications via FCM, and automated email workflows.",
    highlights: ["Financial management system", "Order lifecycle management", "Stock & inventory system", "CRM with customer insights"],
  },
  {
    name: "HR Management System",
    tech: ["C#", "SQL Server", "Desktop App"],
    description: "Desktop application for employee scheduling, fingerprint attendance tracking, automated payroll, and Comsys HR data migration.",
    highlights: ["Fingerprint attendance tracking", "Automated payroll calculation", "Activity logging & auditing", "Data migration integration"],
  },
  {
    name: "Employee Evaluation & Training System",
    tech: ["Next.js", "SQL", "Local Web App"],
    description: "Performance evaluation and training recommendation system with dashboards for senior management.",
    highlights: ["Performance-based evaluations", "Training recommendation workflow", "Senior management dashboard", "Data-driven promotion decisions"],
  },
  {
    name: "Movies Streaming Website",
    tech: ["React.js", "Redux", "YouTube API"],
    description: "Responsive movie streaming platform with YouTube trailer integration, search, pagination, and ~30% load time reduction through optimizations.",
    highlights: ["Redux state management", "YouTube API integration", "~30% perf improvement", "Code splitting & optimization"],
  },
];

const skills = {
  "Frontend": ["React.js", "Next.js", "TypeScript", "JavaScript", "Redux", "React Hooks", "Tailwind CSS"],
  "Backend & DB": ["SQL Server", "C#", "Firebase", "Node.js", "Nodemailer"],
  "UX & Design": ["Figma", "Wireframing", "UX Research", "Prototyping"],
  "Tools": ["GitHub", "Power Automate", "Power Apps", "SharePoint", "Trello", "Agile / Scrum"],
};

const courses = [
  "Meta React Course",
  "Advanced User Experience Design – FWD Nanodegree",
  "Product Ownership Course",
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: any) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      delay: (i || 0) * 0.1, 
      ease: [0.22, 1, 0.36, 1] 
    },
  }),
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
      <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <h2 className="font-display text-2xl tracking-tight">{label}</h2>
      <div className="flex-1 h-px bg-border/60 ml-2" />
    </motion.div>
  );
}

// ─── Timeline dot ─────────────────────────────────────────────────────────────

const dotColors: Record<string, string> = {
  accent: "bg-accent shadow-[0_0_15px_hsl(var(--accent)/0.6)]",
  blue: "bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]",
  purple: "bg-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.5)]",
};
const borderColors: Record<string, string> = {
  accent: "border-accent/40",
  blue: "border-blue-400/40",
  purple: "border-purple-400/40",
};
const badgeColors: Record<string, string> = {
  accent: "bg-accent/10 text-accent border-accent/30",
  blue: "bg-blue-400/10 text-blue-300 border-blue-400/30",
  purple: "bg-purple-400/10 text-purple-300 border-purple-400/30",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ResumeContent = () => {
  const { gainXP } = useXP();

  const handleCollectXP = (e: React.MouseEvent, amount: number = 10) => {
    gainXP(amount, e.clientX, e.clientY);
    
    // Add a little haptic-like scale effect to the clicked element if needed
    const target = e.currentTarget as HTMLElement;
    target.style.transform = "scale(0.95)";
    setTimeout(() => {
      target.style.transform = "";
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-accent/10 blur-[140px] rounded-full top-[-200px] left-[-200px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/8 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />
        <ParticlesCanvas speed={0.3} opacity={0.15} />
      </div>

      <div className="container px-6 pt-28 pb-24 max-w-5xl mx-auto">

        {/* ── HERO HEADER ── */}
        <Section className="mb-20">
          <motion.div variants={fadeUp} className="h-px w-16 bg-accent origin-left mb-8" />

          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.25em] text-accent mb-3 font-medium">
                Curriculum Vitae
              </motion.p>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-none mb-4"
              >
                Abdelrhman<br />
                <span className="text-accent italic">Shihab</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-xl text-muted-foreground font-light mb-6">
                Software Engineer · React.js & Next.js
              </motion.p>

              {/* Contact chips */}
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-2">
                {[
                  { icon: MapPin, label: "Cairo, Egypt" },
                  { icon: Phone, label: "+201287419214" },
                  { icon: Shield, label: "Military: Completed" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 text-xs text-muted-foreground">
                    <Icon className="w-3 h-3" /> {label}
                  </span>
                ))}
                {[
                  { icon: Mail, label: "Email", href: "mailto:abdelrhmanshehab147@gmail.com" },
                  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/abdelrhman-shehab/" },
                  { icon: Github, label: "GitHub", href: "https://github.com/AbdelrhmanShehab" },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 text-xs text-muted-foreground hover:text-accent hover:border-accent transition-colors">
                    <Icon className="w-3 h-3" /> {label} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </motion.div>

              {/* Download CTA */}
              <motion.div variants={fadeUp} custom={4} className="mt-8">
                <Magnetic strength={0.2}>
                  <motion.a
                    href="/cv.pdf"
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleCollectXP(e as any, 50)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium text-sm hover:shadow-glow transition-all interactive"
                  >
                    <Download className="w-4 h-4" /> Download PDF Version
                  </motion.a>
                </Magnetic>
              </motion.div>
            </div>

            {/* Summary card */}
            <motion.div
              variants={fadeUp}
              custom={2}
              className="md:max-w-[360px] rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                Results-driven Software Engineer specializing in{" "}
                <span className="text-foreground font-medium">React.js and Next.js</span>, with a proven track record of
                translating business requirements into scalable, high-performance web applications across HR, POS,
                evaluation platforms, and e-commerce.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* ── EXPERIENCE TIMELINE ── */}
        <Section className="mb-20">
          <SectionHeading icon={Briefcase} label="Experience" />

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border/60" />

            <div className="space-y-10 pl-14">
              {experience.map((job, i) => (
                <motion.div key={job.company} variants={fadeUp} custom={i}>
                  {/* Timeline dot */}
                  <div className={`absolute left-0 w-10 h-10 rounded-full bg-card border-2 ${borderColors[job.color] || "border-border"} flex items-center justify-center`}
                    style={{ marginTop: "2px" }}>
                    <div className={`w-3 h-3 rounded-full ${dotColors[job.color] || "bg-muted"}`} />
                  </div>

                  <div 
                    onClick={(e) => handleCollectXP(e as any, 15)}
                    className={`rounded-2xl border ${borderColors[job.color] || "border-border"} bg-card/50 backdrop-blur-sm p-6 hover:shadow-soft transition-all duration-300 group cursor-pointer active:scale-[0.99]`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-display text-lg text-foreground group-hover:text-accent transition-colors">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${badgeColors[job.color]}`}>{job.type}</span>
                        <span className="text-xs text-muted-foreground font-mono">{job.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {job.bullets.map((b, bi) => (
                        <li key={bi} className="flex gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── EDUCATION ── */}
        <Section className="mb-20">
          <SectionHeading icon={GraduationCap} label="Education" />

          <motion.div
            variants={fadeUp}
            className="relative pl-14"
          >
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border/60" />
            <div className="absolute left-0 w-10 h-10 rounded-full bg-card border-2 border-accent/40 flex items-center justify-center" style={{ marginTop: "2px" }}>
              <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_hsl(18_70%_62%/0.6)]" />
            </div>

            <div className="rounded-2xl border border-accent/40 bg-card/50 backdrop-blur-sm p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display text-lg">El-Shorouk Academy (SHA)</h3>
                  <p className="text-sm text-muted-foreground">Bachelor's Degree in Computer and Information Science</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">Sep 2019 – Jul 2023</span>
              </div>

              <div className="rounded-xl bg-accent/5 border border-accent/20 p-4">
                <p className="text-xs uppercase tracking-widest text-accent mb-2 font-medium">Graduation Project</p>
                <h4 className="font-display text-base mb-1">Customized Psychological Diagnosis System (INFLOW)</h4>
                <p className="text-sm text-muted-foreground">
                  Led UX and frontend development for a client-focused web and mobile solution that improved communication,
                  workflow efficiency, and psychological assessment, while collaborating directly with stakeholders to gather requirements.
                </p>
              </div>
            </div>
          </motion.div>
        </Section>

        {/* ── PROJECTS ── */}
        <Section className="mb-20">
          <SectionHeading icon={Code2} label="Projects" />

          <div className="grid sm:grid-cols-2 gap-5">
            {projects.map((proj, i) => (
              <Magnetic key={proj.name} strength={0.15}>
                <motion.div
                  variants={fadeUp}
                  custom={i}
                  onClick={(e) => handleCollectXP(e as any, 20)}
                  className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 hover:border-accent/40 hover:shadow-glow transition-all duration-300 group cursor-pointer active:scale-[0.98] h-full"
                >
                  <h3 className="font-display text-base mb-2 group-hover:text-accent transition-colors">{proj.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{proj.description}</p>
  
                  {/* Highlights */}
                  <ul className="space-y-1.5 mb-5">
                    {proj.highlights.map((h, hi) => (
                      <li key={hi} className="flex gap-2 text-xs text-muted-foreground">
                        <span className="text-accent flex-shrink-0">✦</span> {h}
                      </li>
                    ))}
                  </ul>
  
                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Magnetic>
            ))}
          </div>
        </Section>

        {/* ── SKILLS ── */}
        <Section className="mb-20">
          <SectionHeading icon={Cpu} label="Skills" />

          <div className="grid sm:grid-cols-2 gap-5">
            {Object.entries(skills).map(([category, items], i) => {
              const icons: Record<string, React.ElementType> = {
                "Frontend": Code2,
                "Backend & DB": Wrench,
                "UX & Design": Palette,
                "Tools": Briefcase,
              };
              const Icon = icons[category] ?? Code2;
              return (
                <motion.div key={category} variants={fadeUp} custom={i}
                  className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{ y: -3, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        onClick={(e) => handleCollectXP(e as any, 5)}
                        className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent cursor-pointer transition-colors interactive"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* ── COURSES ── */}
        <Section className="mb-20">
          <SectionHeading icon={Award} label="Courses & Certifications" />
          <div className="flex flex-wrap gap-4">
            {courses.map((c, i) => (
              <motion.div key={c} variants={fadeUp} custom={i}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm text-sm text-muted-foreground hover:border-accent/40 hover:text-foreground transition-all">
                <Award className="w-4 h-4 text-accent flex-shrink-0" />
                {c}
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── FOOTER CTA ── */}
        <Section>
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-accent/30 bg-accent/5 backdrop-blur-sm p-8 text-center"
          >
            <p className="text-muted-foreground text-sm mb-4">
              Interested in working together?
            </p>
            <h3 className="font-display text-2xl mb-6">Let's build something great.</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <motion.a
                href="mailto:abdelrhmanshehab147@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background border border-foreground text-sm font-medium hover:shadow-glow transition-all"
              >
                <Mail className="w-4 h-4" /> Email Me
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-accent/10 hover:border-accent transition-all"
              >
                View Portfolio
              </motion.a>
            </div>
          </motion.div>
        </Section>

      </div>
    </div>
  );
};

const Resume = () => {
  return <ResumeContent />;
};

export default Resume;