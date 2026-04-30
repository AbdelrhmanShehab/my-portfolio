import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import Buddy from "./Buddy";

// Removed manual Eye implementation as it's replaced by Buddy

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

          {/* === BUDDY MASCOT === */}
          <div className="flex justify-center mb-14">
            <div className="scale-150 transform transition-transform">
              <Buddy />
            </div>
          </div>

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
