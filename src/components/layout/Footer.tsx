
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-8 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © {currentYear} Shateer Games. All rights reserved.
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
