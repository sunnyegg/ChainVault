import { useEffect } from "react";
import { Icon, SelectItem } from "@tixia/design-system";
import { Link } from "react-router-dom";

const SCHEMA = [
  { label: "Vault", icon: "streamline:safe-vault-solid", href: "/app" },
  { label: "Testing", icon: "solar:bug-bold-duotone", href: "/testing" },
];

export const Navbar = ({ expanded, setExpanded }: { expanded: boolean, setExpanded: (expanded: boolean) => void }) => {

  useEffect(() => {
    const setNavbarHeight = () => {
      document.documentElement.style.setProperty('--navbar-height', `${window.innerHeight}px`);
    };
    setNavbarHeight();
    window.addEventListener('resize', setNavbarHeight);
    return () => window.removeEventListener('resize', setNavbarHeight);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 min-h-screen z-30 bg-slate-700 shadow-lg border-r border-slate-800 transition-all duration-200 flex flex-col items-center group w-16 hover:w-56 ${
        expanded ? "w-56" : "w-16"
      }`}
      style={{ height: 'var(--navbar-height)' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 w-full mb-4">
        <Icon icon="twemoji:weary-cat" spin={expanded} />
      </div>
      <div className="flex flex-col gap-2 w-full flex-1">
        {SCHEMA.map((item) => (
          <Link to={item.href} key={item.label} className="w-full text-white">
            <SelectItem
              value={item.label}
              className={`w-full px-4 py-3 text-lg rounded-none hover:bg-slate-800 transition-all duration-200 flex ${
                expanded
                  ? "justify-start text-left"
                  : "justify-center text-center"
              }`}
            >
              <span className="flex items-center justify-center text-2xl w-8 h-8">
                <Icon icon={item.icon} />
              </span>
              <span
                className={`ml-2 transition-all duration-200 ${
                  expanded
                    ? "opacity-100 w-auto"
                    : "hidden"
                }`}
              >
                {item.label}
              </span>
            </SelectItem>
          </Link>
        ))}
      </div>
    </nav>
  );
};
