import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useCustomCursor } from "@/hooks/useCustomCursor";
import "@/index.css";

const NotFound = () => {
  const location = useLocation();
  const cursorRef = useCustomCursor();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative font-sans antialiased text-sm md:text-base text-stardust-grey">
      <div ref={cursorRef} className="custom-cursor"></div>
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="relative z-10 flex flex-col w-full min-h-screen items-center justify-center text-center p-4">
        <h1 className="text-5xl md:text-7xl font-black text-white">404</h1>
        <p className="text-lg md:text-xl text-stardust-grey mt-4">Oops! Page not found.</p>
        <a href="/" className="text-cosmic-teal mt-6 text-sm hover:underline">
          &larr; Return to Mission Control
        </a>
      </div>
    </div>
  );
};

export default NotFound;
