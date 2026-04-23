import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/40">
      <div className="container px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl text-foreground tracking-tight">
          Abdelrhman Shihab
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="/#projects"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Work
          </a>
          <a
            href="/#about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            About
          </a>
          <a
            href="/#contact"
            className="text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/10 transition-colors px-5 py-2 rounded-full border border-border"
          >
            Contact
          </a>
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
              <a href="/#projects" onClick={() => setOpen(false)} className="text-foreground">Work</a>
              <a href="/#about" onClick={() => setOpen(false)} className="text-foreground">About</a>
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                className="border border-border px-5 py-3 rounded-full text-center font-medium"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
