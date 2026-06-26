import { Link, NavLink, useLocation } from \"react-router-dom\";
import { useEffect, useState } from \"react\";
import { Menu, X, Phone } from \"lucide-react\";

const navItems = [
  { to: \"/\", label: \"Home\" },
  { to: \"/properties?type=sale\", label: \"Buy\" },
  { to: \"/properties?type=rent\", label: \"Rent\" },
  { to: \"/valuation\", label: \"Valuation\" },
  { to: \"/about\", label: \"About\" },
  { to: \"/contact\", label: \"Contact\" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener(\"scroll\", onScroll);
    return () => window.removeEventListener(\"scroll\", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const onHome = pathname === \"/\";
  const transparent = onHome && !scrolled;

  return (
    <header
      data-testid=\"site-header\"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? \"bg-transparent border-b border-white/10\"
          : \"bg-[#F9F8F6]/85 backdrop-blur-xl border-b border-[#D1CDCA]\"
      }`}
    >
      <div className=\"max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between h-20\">
        <Link
          to=\"/\"
          data-testid=\"logo-link\"
          className={`font-serif text-2xl md:text-[28px] tracking-tight ${
            transparent ? \"text-[#F9F8F6]\" : \"text-[#0F172A]\"
          }`}
        >
          haart<span className=\"text-[#7A1A2A]\">.</span>
          <span className=\"text-xs ml-2 align-middle tracking-[0.3em] font-sans uppercase opacity-70\">
            Cambridge
          </span>
        </Link>

        <nav className=\"hidden lg:flex items-center gap-9\">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                  transparent
                    ? \"text-[#F9F8F6]/90 hover:text-white\"
                    : \"text-[#475569] hover:text-[#7A1A2A]\"
                } ${isActive ? \"font-semibold\" : \"font-medium\"}`
              }
              end={n.to === \"/\"}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className=\"hidden lg:flex items-center gap-4\">
          <a
            href=\"tel:+441223785791\"
            data-testid=\"header-call-link\"
            className={`flex items-center gap-2 text-xs uppercase tracking-[0.18em] ${
              transparent ? \"text-[#F9F8F6]\" : \"text-[#0F172A]\"
            }`}
          >
            <Phone size={14} strokeWidth={1.5} />
            01223 785 791
          </a>
        </div>

        <button
          data-testid=\"mobile-menu-toggle\"
          className={`lg:hidden ${transparent ? \"text-white\" : \"text-[#0F172A]\"}`}
          onClick={() => setOpen((v) => !v)}
          aria-label=\"toggle menu\"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className=\"lg:hidden bg-[#F9F8F6] border-t border-[#D1CDCA] px-6 py-6 space-y-4\">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`mobile-nav-${n.label.toLowerCase()}`}
              className=\"block text-sm uppercase tracking-[0.18em] text-[#0F172A]\"
            >
              {n.label}
            </NavLink>
          ))}
          <a
            href=\"tel:+441223785791\"
            className=\"block text-sm uppercase tracking-[0.18em] text-[#7A1A2A]\"
            data-testid=\"mobile-call-link\"
          >
            Call 01223 785 791
          </a>
        </div>
      )}
    </header>
  );
}
