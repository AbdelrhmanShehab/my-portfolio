import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isResume = location.pathname === "/resume";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/40">
      <div className="container px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl text-foreground tracking-tight">
          Abdelrhman Shihab
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {!isResume && (
            <>
              <a href="/#projects" onClick={() => trackEvent("nav_click", { target: "work" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Work</a>
              <a href="/#about" onClick={() => trackEvent("nav_click", { target: "about" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">About</a>
              <a href="/#contact" onClick={() => trackEvent("nav_click", { target: "contact" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Contact</a>
            </>
          )}
          <Link
            to="/resume"
            className={`text-sm px-5 py-2 rounded-full border transition-colors ${
              isResume
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border text-foreground/80 hover:bg-accent/10 hover:border-accent hover:text-accent"
            }`}
          >
            Resume
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {!isResume && (
                <>
                  <a href="/#projects" onClick={() => setOpen(false)} className="text-foreground">Work</a>
                  <a href="/#about" onClick={() => setOpen(false)} className="text-foreground">About</a>
                  <a href="/#contact" onClick={() => setOpen(false)} className="text-foreground">Contact</a>
                </>
              )}
              <Link
                to="/resume"
                onClick={() => setOpen(false)}
                className="border border-accent px-5 py-3 rounded-full text-center font-medium text-accent"
              >
                Resume
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
