const Footer = () => {
  return (
    <footer className="py-10 border-t border-border">
      <div className="container px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Abdelrhman Shihab. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="https://github.com/AbdelrhmanShehab/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/abdelrhman-shihab-372bb2228/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href="https://www.behance.net/abdelrhmanhossam" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Behance</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
