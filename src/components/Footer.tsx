import { Github, Linkedin, Palette } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-10 border-t border-border mt-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container px-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <p className="text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} Abdelrhman Shihab. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://github.com/AbdelrhmanShehab/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/50 border border-white/5 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-sm hover:shadow-accent/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Github className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors relative z-10" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors relative z-10 tracking-wide">GitHub</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/abdelrhman-shihab-372bb2228/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/50 border border-white/5 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-sm hover:shadow-accent/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors relative z-10" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors relative z-10 tracking-wide">LinkedIn</span>
          </a>
          <a 
            href="https://www.behance.net/abdelrhmanhossam" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/50 border border-white/5 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-sm hover:shadow-accent/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Palette className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors relative z-10" />
            <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors relative z-10 tracking-wide">Behance</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
