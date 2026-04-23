import { motion } from "framer-motion";
import { ArrowDown, MapPin, Download, ArrowUpRight } from "lucide-react";
import abdelrhmanPhoto from "@/assets/abdelrhman.jpg";

const skills = ["React.js", "Next.js", "TypeScript", "UX Design", "SQL"];

const stats = [
  { value: "5+", label: "Full systems shipped" },
  { value: "1+", label: "Years experience" },
  { value: "~30%", label: "Avg. perf. gains" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      <div className="container relative z-10 px-6">
        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-px w-16 bg-accent origin-left mb-8"
        />

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          {/* LEFT — Resume content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8 tracking-wide"
            >
              <MapPin className="w-3.5 h-3.5" />
              Cairo, Egypt
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-8"
            >
              I don't just write
              <br />
              code — I mind the
              <br />
              <span className="italic text-accent">business</span> behind it.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-base sm:text-lg text-muted-foreground max-w-md mb-10 leading-relaxed"
            >
              I'm Abdelrhman Shihab — a software engineer who bridges business
              requirements and clean code. I build fast, scalable React &
              Next.js systems that actually solve real problems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-transparent text-foreground text-sm font-medium transition-all duration-300 hover:bg-foreground hover:text-background hover:border-foreground hover:-translate-y-0.5 hover:shadow-glow"
              >
                View My Work
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
              <a
                href="/cv.pdf"
                download
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-transparent text-foreground text-sm font-medium transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:border-accent hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                Download CV
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="border-t border-border/60 pt-8"
            >
              <div className="grid grid-cols-3 gap-6 max-w-md">
                {stats.map((stat) => (
                  <div key={stat.label} className="group cursor-default">
                    <div className="font-display text-3xl sm:text-4xl text-foreground mb-1.5 transition-colors duration-300 group-hover:text-accent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground leading-snug">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Photo + skill tags */}
          <div className="flex flex-col items-center lg:items-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, rotate: -1 }}
              className="relative group cursor-pointer"
            >
              {/* Pulsing accent ring on hover */}
              <div className="absolute -inset-2 rounded-[36px] border border-accent/0 group-hover:border-accent/40 transition-all duration-500 group-hover:scale-[1.02]" />
              {/* Stronger soft glow on hover */}
              <div className="absolute -inset-6 rounded-[40px] bg-accent/0 group-hover:bg-accent/20 blur-3xl transition-all duration-700" />
              {/* Rotating dashed ring - changed to a static decorative border for better rectangular fit */}
              <div className="absolute -inset-3 rounded-[38px] border border-dashed border-accent/0 group-hover:border-accent/30 transition-all duration-700" />

              <div className="relative w-full aspect-[4/5] max-w-[400px] lg:max-w-[450px] rounded-[32px] border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-500 group-hover:border-accent group-hover:shadow-glow">
                <img
                  src={abdelrhmanPhoto}
                  alt="Abdelrhman Shihab"
                  className="w-full h-full object-cover scale-[1.3] transition-transform duration-700 group-hover:scale-[1.4]"
                />
                {/* Subtle color overlay on hover */}
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 mix-blend-overlay transition-all duration-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-2 mt-6 justify-center lg:justify-end max-w-[340px]"
            >
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground transition-all duration-300 hover:text-accent-foreground hover:bg-accent hover:border-accent hover:-translate-y-1 hover:scale-105 hover:shadow-glow cursor-default"
                >
                  {skill}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-16"
        >
          <a
            href="#projects"
            aria-label="Scroll to projects"
            className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
