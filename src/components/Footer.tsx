import { PolicyDialogs } from "./PolicyDialogs";

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 py-4 md:py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 text-white/50 text-xs md:text-sm">
        <PolicyDialogs />
        <p>©2024 Gambix LLC. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;