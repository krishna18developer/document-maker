import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link 
              href="https://kriaasystems.in" 
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Made by Kriaa Systems
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="https://github.com/kriaasystems" 
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link 
              href="https://instagram.com/kriaasystems" 
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.linkedin.com/company/kriaa-systems" 
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 