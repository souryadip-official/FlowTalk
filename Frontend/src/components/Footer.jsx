import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'; 

export default function Footer() {
  return (
    <footer className="w-full bg-base-200 py-6 mt-12 sticky bottom-0">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        {/* FlowTalk Private Limited */}
        <div className="text-base-content font-semibold text-lg mb-2">
          FlowTalk Private Limited
        </div>

        {/* Copyright */}
        <div className="text-base-content text-sm mb-2">
          Copyright &copy; 2025
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-2">
          <a href="#" className="hover:text-primary transition-all">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-primary transition-all">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-primary transition-all">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-primary transition-all">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>

        {/* Made with ❤️ by Souryadip */}
        <div className="text-base-content text-sm mb-2">
          Made with ❤️ by Souryadip
        </div>

        {/* Privacy and Terms buttons */}
        <div className="flex justify-center gap-4">
          <button className="btn btn-link text-sm hover:bg-base-300 transition-all">
            Privacy
          </button>
          <button className="btn btn-link text-sm hover:bg-base-300 transition-all">
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
};