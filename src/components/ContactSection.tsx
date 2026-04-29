import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const Eye = ({ mousePos, containerRef }: { mousePos: { x: number; y: number }; containerRef: React.RefObject<HTMLDivElement> }) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!eyeRef.current || !containerRef.current) return;

    const eyeRect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const dx = mousePos.x - eyeCenterX;
    const dy = mousePos.y - eyeCenterY;
    const angle = Math.atan2(dy, dx);
    const maxTravel = 8;

    setPupilPos({
      x: Math.cos(angle) * maxTravel,
      y: Math.sin(angle) * maxTravel,
    });
  }, [mousePos, containerRef]);

  return (
    <div
      ref={eyeRef}
      className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-inner relative overflow-hidden"
      style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.15)" }}
    >
      {/* Iris */}
      <div
        className="w-8 h-8 rounded-full bg-accent flex items-center justify-center transition-transform"
        style={{
          transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
          transition: "transform 0.08s ease-out",
        }}
      >
        {/* Pupil */}
        <div className="w-4 h-4 rounded-full bg-background/90 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground/80" />
        </div>
      </div>
      {/* Shine */}
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/70 pointer-events-none" />
    </div>
  );
};

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 sm:py-32 border-t border-border/50 relative overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/8 blur-[140px]" />
      </div>

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4">
            Let's Talk
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display tracking-tight mb-6">
            Have a project in{" "}
            <span className="italic text-accent">mind</span>?
          </h2>

          <p className="text-lg text-muted-foreground mb-14 leading-relaxed max-w-xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>

          {/* === FACE WITH TRACKING EYES === */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-14"
          >
            <div className="relative">
              {/* Glow halo */}
              <div className="absolute inset-0 rounded-[3rem] bg-accent/20 blur-3xl scale-110 opacity-60" />

              {/* Face body */}
              <div
                className="relative w-44 h-44 rounded-[3rem] flex flex-col items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--card)/0.6) 100%)",
                  border: "1.5px solid hsl(var(--border)/0.6)",
                  boxShadow: "0 8px 40px hsl(var(--accent)/0.15), inset 0 1px 0 hsl(255 255 255 / 0.05)",
                }}
              >
                {/* Eyes row */}
                <div className="flex gap-5 mb-1">
                  <Eye mousePos={mousePos} containerRef={sectionRef as React.RefObject<HTMLDivElement>} />
                  <Eye mousePos={mousePos} containerRef={sectionRef as React.RefObject<HTMLDivElement>} />
                </div>

                {/* Smile */}
                <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="mt-1">
                  <path
                    d="M4 4 Q20 18 36 4"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                {/* Cheek blushes */}
                <div className="absolute bottom-10 left-6 w-6 h-3 rounded-full bg-pink-400/30 blur-sm" />
                <div className="absolute bottom-10 right-6 w-6 h-3 rounded-full bg-pink-400/30 blur-sm" />
              </div>
            </div>
          </motion.div>

          {/* Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-3 bg-accent/25 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <a
                href="mailto:abdlrhman.shihab@gmail.com"
                className="relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-foreground text-background font-semibold text-base shadow-lg group-hover:scale-105 transition-transform duration-300"
              >
                <Mail className="w-5 h-5" />
                abdlrhman.shihab@gmail.com
              </a>
            </div>

            <a
              href="tel:+201287419214"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              <Phone className="w-4 h-4" />
              +20 128 741 9214
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default ContactSection;
