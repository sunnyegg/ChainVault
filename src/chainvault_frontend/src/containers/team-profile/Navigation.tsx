import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { contentSchema } from "./schema/schema";
// import { resume } from "@/constants/resume";

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [hidden, setHidden] = useState(window.innerWidth < 640);
  // const { downloadLink } = resume;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
    // Only hide navigation on mobile
    if (window.innerWidth < 640) {
      setHidden(true);
    }
  };

  // Reset hidden state when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        // 640px is sm breakpoint in Tailwind
        setHidden(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = contentSchema.map(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return { id, top: 0 };
        const rect = element.getBoundingClientRect();
        return { id, top: Math.abs(rect.top) };
      });

      const closest = sections.reduce((prev, curr) =>
        prev.top < curr.top ? prev : curr
      );

      setActiveSection(closest.id);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setHidden(!hidden)}
        className="bg-white text-gray-900 p-3 rounded-full shadow-lg sm:hidden fixed top-4 right-4 z-50"
      >
        <Icon icon={hidden ? "mdi:menu" : "mdi:close"} className="w-6 h-6" />
      </motion.button>

      <motion.nav
        initial={false}
        animate={{
          y: hidden ? -100 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`
          fixed w-full flex max-sm:flex-col justify-between items-center p-4 
          bg-white/90 backdrop-blur-sm shadow-md z-40
          sm:translate-y-0 sm:opacity-100
        `}
      >
        <DayTime />
        <motion.ul className="max-sm:flex-col no-list-style flex items-center justify-center gap-4 sm:gap-8">
          {contentSchema.map(({ id, title }) => (
            <motion.li
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition-colors hover:text-theme ${
                activeSection === id
                  ? `text-theme font-medium`
                  : "text-gray-600"
              }`}
              onClick={() => scrollToSection(id)}
            >
              {title}
            </motion.li>
          ))}
        </motion.ul>
      </motion.nav>
    </>
  );
};

const DayTime = () => {
  const singaporeTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Singapore",
  });

  const singaporeHour = new Date(singaporeTime).getHours();
  const isDay = singaporeHour >= 6 && singaporeHour < 18;

  const icons = isDay
    ? "meteocons:clear-day-fill"
    : "meteocons:clear-night-fill";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-sm:hidden flex items-center gap-2"
    >
      <Icon icon={icons} className="w-10 h-10" />
      <p className="text-sm text-gray-500">in Singapore</p>
    </motion.div>
  );
};
