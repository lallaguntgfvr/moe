import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Menu,
  Moon,
  ScanLine,
  X,
  Zap,
  ZapOff,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { navigation, type PageId } from "../data";
import { readDisplayPreference, readMotionPreference } from "../preferences";

type LayoutProps = {
  page: PageId;
  children: ReactNode;
};

export default function Layout({ page, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visits, setVisits] = useState(1);
  const [now, setNow] = useState(() => new Date());
  const [crt, setCrt] = useState(() =>
    readDisplayPreference("secret-room-crt", "off"),
  );
  const [motion, setMotion] = useState(readMotionPreference);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pageIndex = navigation.findIndex((item) => item.id === page);
  const current = navigation[pageIndex];
  const previous = pageIndex > 0 ? navigation[pageIndex - 1] : null;
  const next =
    pageIndex < navigation.length - 1
      ? navigation[pageIndex + 1]
      : navigation[0];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 721px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    try {
      let count = Number(localStorage.getItem("kurarin-local-visits") ?? "0");
      if (!Number.isFinite(count) || count < 0) count = 0;
      if (!sessionStorage.getItem("kurarin-visit-counted")) {
        count += 1;
        localStorage.setItem("kurarin-local-visits", String(count));
        sessionStorage.setItem("kurarin-visit-counted", "yes");
      }
      setVisits(Math.max(1, count));
    } catch {
      setVisits(1);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("secret-room-crt", crt ? "on" : "off");
    } catch {
      // The visual preference still applies for this page.
    }
  }, [crt]);

  useEffect(() => {
    try {
      localStorage.setItem("secret-room-motion", motion ? "full" : "reduced");
    } catch {
      // The visual preference still applies for this page.
    }
  }, [motion]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key === "Tab") {
        const controls =
          menuRef.current?.querySelectorAll<HTMLElement>("a[href], button");
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [mobileOpen]);

  return (
    <div className={`site ${!motion ? "reduce-motion" : ""}`}>
      <a className="skip-link" href="#main-content">
        skip to content
      </a>
      {crt && <div className="crt-overlay" aria-hidden="true" />}
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="mobile-bar" inert={mobileOpen || undefined}>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open site menu"
          aria-expanded={mobileOpen}
          aria-controls="site-menu"
        >
          <Menu size={16} /> menu
        </button>
        <a href="./index.html">moe moe kyun~</a>
        <Moon size={15} aria-hidden="true" />
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close site menu"
          tabIndex={-1}
        />
      )}

      <aside
        id="site-menu"
        ref={menuRef}
        className={`sidebar ${mobileOpen ? "is-open" : ""}`}
        aria-label="Site menu"
        role={mobileOpen ? "dialog" : undefined}
        aria-modal={mobileOpen || undefined}
      >
        <div className="sidebar-brand-row">
          <a className="sidebar-brand" href="./index.html">
            <Moon size={25} strokeWidth={1.4} aria-hidden="true" />
            <span>
              moe moe
              <br />
              kyun~
            </span>
          </a>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close site menu"
          >
            <X size={17} />
          </button>
        </div>
        <p className="sidebar-url">after_dark / {current.file}</p>
        <div className="lace-divider" aria-hidden="true">
          · ⊹ · ⊹ · ⊹ ·
        </div>

        <nav aria-label="Site directory">
          <p className="side-label">site directory</p>
          <ul className="main-nav">
            {navigation.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`./${item.file}`}
                  title={item.hint}
                  className={page === item.id ? "active" : ""}
                  aria-current={page === item.id ? "page" : undefined}
                >
                  <span className="nav-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="side-status">
          <p>
            <span className="status-light" aria-hidden="true" /> online,
            probably
          </p>
          <dl>
            <div>
              <dt>local time</dt>
              <dd>
                {now.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            <div>
              <dt>browser visits</dt>
              <dd>{String(visits).padStart(3, "0")}</dd>
            </div>
          </dl>
        </div>

        <div className="side-settings">
          <p className="side-label">display settings</p>
          <button
            type="button"
            onClick={() => setCrt((value) => !value)}
            aria-pressed={crt}
          >
            <ScanLine size={13} aria-hidden="true" /> crt glass{" "}
            <span>{crt ? "on" : "off"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMotion((value) => !value)}
            aria-pressed={motion}
          >
            {motion ? <Zap size={13} /> : <ZapOff size={13} />} motion{" "}
            <span>{motion ? "on" : "off"}</span>
          </button>
        </div>
        <p className="sidebar-footnote">
          best viewed with
          <br />a little insomnia
        </p>
      </aside>

      <div className="page-wrap" inert={mobileOpen || undefined}>
        <main
          id="main-content"
          className={`main-column page-${page}`}
          tabIndex={-1}
        >
          {page !== "home" && (
            <header className="page-heading">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="./index.html">secret room</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{current.id}</span>
              </nav>
              <h1>{current.title}</h1>
              <p>{current.description}</p>
            </header>
          )}

          {children}

          <nav className="page-pagination" aria-label="More rooms">
            {previous ? (
              <a href={`./${previous.file}`} rel="prev">
                <ArrowLeft size={15} aria-hidden="true" />
                <span>
                  <small>previous room</small>
                  <b>{previous.label}</b>
                </span>
              </a>
            ) : (
              <span />
            )}
            <a href={`./${next.file}`} rel="next">
              <span>
                <small>
                  {page === "links" ? "back to the entrance" : "next room"}
                </small>
                <b>{next.label}</b>
              </span>
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </nav>

          <footer className="site-footer">
            <div className="footer-ornament" aria-hidden="true">
              ‧₊˚✧ ⊹ ˚ . ✧˚₊‧
            </div>
            <p>
              a dark-moe personal homepage study · original interface, borrowed
              pixels credited in neighbors.
            </p>
            <p>
              no cookies · no analytics · your letters never leave your browser
            </p>
            <nav aria-label="Footer navigation">
              <a href="./about.html">about</a>
              <a href="./guestbook.html">guestbook</a>
              <a href="./links.html">credits</a>
              <a
                href="#main-content"
                onClick={(event) => {
                  event.preventDefault();
                  window.scrollTo({
                    top: 0,
                    behavior: motion ? "smooth" : "auto",
                  });
                }}
              >
                back to top <ArrowUp size={11} />
              </a>
            </nav>
          </footer>
        </main>
      </div>
    </div>
  );
}
