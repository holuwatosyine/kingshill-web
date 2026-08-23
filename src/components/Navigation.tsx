import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import LogoImage from "@/assets/kingshill-logo-official.webp";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Training", href: "/training" },
  { name: "Faculty", href: "/faculty" },
  { name: "Resources", href: "/resources" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("kh-menu-open", isOpen);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.documentElement.classList.remove("kh-menu-open"); window.removeEventListener("keydown", onKey); };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    const current = navItems.findIndex((item) => item.href === location.pathname);
    setActiveIndex(Math.max(0, current));
  }, [location.pathname]);

  return (
    <header className={`kh-nav ${location.pathname === "/" ? "kh-nav--home" : ""} ${isOpen ? "kh-nav--open" : ""}`}>
      <div className="kh-nav__inner">
        <Link to="/" className="kh-nav__brand" aria-label="Kingshill School of Discovery home">
          <span className="kh-nav__crest">
            <img src={LogoImage} alt="" />
          </span>
          <span className="kh-nav__wordmark">
            <strong>Kingshill</strong>
            <small>School of Discovery</small>
          </span>
        </Link>

        <button
          type="button"
          className="kh-nav__trigger"
          aria-expanded={isOpen}
          aria-controls="site-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{isOpen ? "Close" : "Menu"}</span>
          <span className="kh-nav__trigger-mark" aria-hidden="true">{isOpen ? <X /> : <Menu />}</span>
        </button>
      </div>

      <div id="site-menu" className={`kh-menu ${isOpen ? "kh-menu--open" : ""}`} aria-hidden={!isOpen}>
        <div className="kh-menu__wash" aria-hidden="true" />
        <p className="kh-menu__ghost" aria-hidden="true">{navItems[activeIndex].name}</p>
        <div className="kh-menu__content">
          <div className="kh-menu__meta">
            <p className="kh-menu__label">Navigation</p>
            <p>At KingsHill, We Unlock Potential.<br />We Raise Builders and Reformers.</p>
            <a href="mailto:pg@thecoachingnations.com">pg@thecoachingnations.com</a>
          </div>
          <nav className="kh-menu__rail" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                tabIndex={isOpen ? 0 : -1}
                className={location.pathname === item.href ? "is-active" : ""}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>{item.name}</span>
                <em>View</em>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <p className="kh-menu__foot">Nigeria's First Registered Coaching Academy <span>{String(activeIndex + 1).padStart(2, "0")} / {String(navItems.length).padStart(2, "0")}</span></p>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
