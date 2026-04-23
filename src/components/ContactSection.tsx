import { motion } from "framer-motion";
import { Mail, ArrowUpRight, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 sm:py-32 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-accent text-xs font-medium tracking-[0.2em] uppercase mb-4">
            Let's Talk
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display tracking-tight mb-6">
            Have a project in <span className="italic text-accent">mind</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>

          <div className="relative inline-block">
            <div className="absolute -inset-6 bg-accent/20 rounded-full blur-2xl opacity-70 animate-pulse" />
            <a
              href="mailto:abdlrhman.shihab@gmail.com"
              className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-medium shadow-glow magnetic-hover"
            >
              <Mail className="w-5 h-5" />
              abdlrhman.shihab@gmail.com
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-8">
            <a
              href="tel:+201287419214"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4" />
              +20 128 741 9214
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
