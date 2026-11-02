import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Menu,
  MessageCircle,
  Moon,
  Music2,
  Pause,
  Play,
  ScanLine,
  Send,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Zap,
  ZapOff,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  gallery,
  navigation,
  neighborButtons,
  recommendations,
  tracks,
  updates,
} from "./data";
import { formatTime, useSynthPlayer } from "./useSynthPlayer";

type GuestEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type WindowProps = {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

const filters = ["all", "jrpg", "visual novel", "dungeon crawler", "horror"];
const guestbookKey = "kurarin-after-dark-guestbook";

function readGuestbook(): GuestEntry[] {
  try {
    const saved = JSON.parse(localStorage.getItem(guestbookKey) ?? "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (entry) =>
        typeof entry?.id === "string" &&
        typeof entry?.name === "string" &&
        typeof entry?.message === "string" &&
        typeof entry?.createdAt === "string",
    );
  } catch {
    return [];
  }
}

function readDisplayPreference(key: string, offValue: string) {
  try {
    return localStorage.getItem(key) !== offValue;
  } catch {
    return true;
  }
}

function Window({ id, title, children, className = "" }: WindowProps) {
  return (
    <section id={id} data-section={id ? true : undefined} className={`window ${className}`}>
      <div className="window-title">
        <span>{title}</span>
        <span className="window-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}

export default function App() {
  const player = useSynthPlayer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [genre, setGenre] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedRec, setSelectedRec] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [entries, setEntries] = useState<GuestEntry[]>(readGuestbook);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestStatus, setGuestStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [visits, setVisits] = useState(1);
  const [now, setNow] = useState(() => new Date());
  const [crt, setCrt] = useState(() => readDisplayPreference("secret-room-crt", "off"));
  const [motion, setMotion] = useState(() => readDisplayPreference("secret-room-motion", "reduced"));

  const filteredRecommendations = useMemo(
    () =>
      genre === "all"
        ? recommendations
        : recommendations.filter((recommendation) => recommendation.genres.includes(genre)),
    [genre],
  );

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-12% 0px -58% 0px", threshold: [0, 0.15, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) window.requestAnimationFrame(() => target.scrollIntoView());
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
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
      localStorage.setItem(guestbookKey, JSON.stringify(entries));
    } catch {
      // The guestbook still works for this session if storage is unavailable.
    }
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem("secret-room-crt", crt ? "on" : "off");
    } catch {
      // The visual preference still applies for this session.
    }
  }, [crt]);

  useEffect(() => {
    try {
      localStorage.setItem("secret-room-motion", motion ? "full" : "reduced");
    } catch {
      // The visual preference still applies for this session.
    }
  }, [motion]);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => (current === null ? 0 : (current + 1) % gallery.length));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? 0 : (current - 1 + gallery.length) % gallery.length,
        );
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex]);

  const followNav = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  const chooseGenre = (nextGenre: string) => {
    setGenre(nextGenre);
    setVisibleCount(6);
    setSelectedRec("");
  };

  const surpriseMe = () => {
    const pool = filteredRecommendations;
    if (!pool.length) return;
    const alternatives = pool.filter((item) => item.title !== selectedRec);
    const choices = alternatives.length ? alternatives : pool;
    const picked = choices[Math.floor(Math.random() * choices.length)];
    const originalIndex = recommendations.indexOf(picked);
    setSelectedRec(picked.title);
    setVisibleCount(pool.length);
    window.setTimeout(() => {
      document.getElementById(`recommendation-${originalIndex}`)?.scrollIntoView({
        behavior: motion ? "smooth" : "auto",
        block: "center",
      });
    }, 60);
  };

  const submitGuestbook = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = guestName.trim();
    const message = guestMessage.trim();
    if (!name || !message) {
      setGuestStatus("please write both a name and a tiny note.");
      return;
    }
    const entry: GuestEntry = {
      id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : String(Date.now()),
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    setEntries((current) => [entry, ...current]);
    setGuestMessage("");
    setGuestStatus("your note is saved in this browser. thank you for stopping by!");
  };

  const copyPageLink = async () => {
    const link = `${window.location.href.split("#")[0]}#links`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      const field = document.createElement("textarea");
      field.value = link;
      document.body.appendChild(field);
      field.select();
      setCopied(document.execCommand("copy"));
      field.remove();
    }
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={`site ${!motion ? "reduce-motion" : ""}`}>
      {crt && <div className="crt-overlay" aria-hidden="true" />}
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="mobile-bar">
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open site menu">
          <Menu size={16} /> menu
        </button>
        <a href="#home" onClick={() => followNav("home")}>
          moe moe kyun~
        </a>
        <Moon size={15} aria-hidden="true" />
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close site menu"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand-row">
          <a className="sidebar-brand" href="#home" onClick={() => followNav("home")}>
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
        <p className="sidebar-url">https://about/after_dark</p>
        <div className="lace-divider" aria-hidden="true">
          · ⊹ · ⊹ · ⊹ ·
        </div>

        <nav aria-label="Site directory">
          <p className="side-label">site directory</p>
          <ul className="main-nav">
            {navigation.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  title={item.hint}
                  className={activeSection === item.id ? "active" : ""}
                  aria-current={activeSection === item.id ? "location" : undefined}
                  onClick={() => followNav(item.id)}
                >
                  <span className="nav-index">0{index + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="side-status">
          <p>
            <span className="status-light" aria-hidden="true" /> online, probably
          </p>
          <dl>
            <div>
              <dt>local time</dt>
              <dd>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</dd>
            </div>
            <div>
              <dt>browser visits</dt>
              <dd>{String(visits).padStart(3, "0")}</dd>
            </div>
          </dl>
        </div>

        <div className="side-settings">
          <p className="side-label">display settings</p>
          <button type="button" onClick={() => setCrt((value) => !value)} aria-pressed={crt}>
            <ScanLine size={13} aria-hidden="true" /> crt glass
            <span>{crt ? "on" : "off"}</span>
          </button>
          <button type="button" onClick={() => setMotion((value) => !value)} aria-pressed={motion}>
            {motion ? <Zap size={13} /> : <ZapOff size={13} />}
            motion
            <span>{motion ? "on" : "off"}</span>
          </button>
        </div>

        <p className="sidebar-footnote">
          best viewed with
          <br />a little insomnia
        </p>
      </aside>

      <div className="page-wrap">
        <main className="main-column">
          <header id="home" data-section className="hero">
            <div className="hero-file">C:\users\kurarin\secret_room\index.html</div>
            <img
              className="hero-sparkle pixel"
              src="https://kyuunkurarin.neocities.org/sparkluluuuu.gif"
              alt=""
            />
            <div className="hero-copy">
              <p>moe moe kyun~ after dark</p>
              <h1>girl&apos;s secret room</h1>
              <span>少女の秘密の部屋</span>
            </div>
            <div className="hero-quote">
              <span>&quot;i am my own parabolic antenna&quot;</span>
              <span className="quote-secret">you found the door. please come in.</span>
            </div>
          </header>

          <div className="ticker" aria-label="Welcome message">
            <div className="ticker-track">
              <span>
                おかえりなさい! welcome home · this site is held together by messy code and scotch tape ·
                please look around · no autoplay · take your time ·&nbsp;
              </span>
              <span aria-hidden="true">
                おかえりなさい! welcome home · this site is held together by messy code and scotch tape ·
                please look around · no autoplay · take your time ·&nbsp;
              </span>
            </div>
          </div>

          <Window id="about" title="/about/read_me.txt" className="about-window">
            <div className="about-grid">
              <div className="intro-copy">
                <div className="section-kicker">
                  <Sparkles size={13} aria-hidden="true" /> welcome to my little corner
                </div>
                <p className="intro-lead">
                  hello! おかえりなさい! welcome to my corner of the world wide web held together by messy
                  code and scotch tape.
                  <img src="https://kyuunkurarin.neocities.org/soraaa.webp" alt="a tiny blue pixel friend" />
                </p>
                <p>
                  i like to talk about games, j-fashion, my offline life, the books i read, photography,
                  and i&apos;m also a collector of figures and cds!!
                </p>
                <hr />
                <p>
                  this digital rabbithole is mainly a mishmash of things that i like, so the appearance
                  won&apos;t stay consistent! ^_^ the phrase <b>moe moe kyun</b> comes from maid cafés—a cute
                  little spell to make your food taste better.
                </p>
                <p>
                  my code is still pretty newbie but it does work!! i&apos;m learning lots and this room is
                  a long passion project. please feel free to look around :D
                </p>
                <div className="about-signoff">
                  <img className="pixel" src="https://kyuunkurarin.neocities.org/bnuuy.gif" alt="pixel bunny" />
                  <span>thank you for visiting my rabbithole.</span>
                </div>
              </div>

              <aside className="profile-card" aria-label="Webmaster profile">
                <div className="profile-image-wrap">
                  <img
                    src="https://kyuunkurarin.neocities.org/download%20(5).jpg"
                    alt="Kurarin's profile in soft muted light"
                  />
                  <span>webmaster.jpg</span>
                </div>
                <p className="profile-handle">@kyunkurarin</p>
                <hr />
                <h2>stats</h2>
                <dl className="profile-stats">
                  <div>
                    <dt>height</dt>
                    <dd>165cm</dd>
                  </div>
                  <div>
                    <dt>languages</dt>
                    <dd>de / en</dd>
                  </div>
                  <div>
                    <dt>birthday</dt>
                    <dd>9 / 22</dd>
                  </div>
                </dl>
                <h2>inventory</h2>
                <ul>
                  <li>bunny plush</li>
                  <li>camera</li>
                  <li>ps vita</li>
                </ul>
                <p className="profile-kaomoji">(ᵕ⸝⸝• ᴗ •)</p>
                <div className="tiny-stars" aria-hidden="true">
                  . ݁₊ ⊹ . ݁ ⟡ ݁ . ⊹ ₊ ݁.
                </div>
              </aside>
            </div>
          </Window>

          <Window title="/now-playing.exe" className="music-window">
            <div className="player-layout">
              <div className={`disc-wrap ${player.isPlaying ? "playing" : ""}`} aria-hidden="true">
                <div className="disc">
                  <span>0{player.trackIndex + 1}</span>
                </div>
                <Music2 size={15} />
              </div>
              <div className="player-main">
                <p className="player-label">now {player.isPlaying ? "playing" : "paused"}</p>
                <h2>{player.track.title}</h2>
                <p className="track-subtitle">{player.track.subtitle}</p>
                <div className="player-controls">
                  <button
                    type="button"
                    onClick={() => player.selectTrack(player.trackIndex - 1)}
                    aria-label="Previous track"
                    title="Previous track"
                  >
                    <SkipBack size={16} fill="currentColor" />
                  </button>
                  <button
                    type="button"
                    className="play-button"
                    onClick={player.toggle}
                    aria-label={player.isPlaying ? "Pause music" : "Play music"}
                  >
                    {player.isPlaying ? (
                      <Pause size={17} fill="currentColor" />
                    ) : (
                      <Play size={17} fill="currentColor" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => player.selectTrack(player.trackIndex + 1)}
                    aria-label="Next track"
                    title="Next track"
                  >
                    <SkipForward size={16} fill="currentColor" />
                  </button>
                  <span className="time-readout">
                    {formatTime(player.position)} / {formatTime(player.track.duration)}
                  </span>
                </div>
                <input
                  className="seek-slider"
                  type="range"
                  min="0"
                  max={player.track.duration}
                  step="0.1"
                  value={player.position}
                  onChange={(event) => player.seek(Number(event.target.value))}
                  aria-label="Seek through current track"
                />
                <div className="volume-row">
                  <button
                    type="button"
                    onClick={() => player.setVolume(player.volume > 0 ? 0 : 0.55)}
                    aria-label={player.volume > 0 ? "Mute music" : "Unmute music"}
                  >
                    {player.volume > 0 ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={player.volume}
                    onChange={(event) => player.setVolume(Number(event.target.value))}
                    aria-label="Music volume"
                  />
                  <span>{Math.round(player.volume * 100)}%</span>
                </div>
                {player.error && <p className="player-error">{player.error}</p>}
              </div>
              <div className="track-list" aria-label="Synth playlist">
                <p>midnight fm</p>
                {tracks.map((track, index) => (
                  <button
                    type="button"
                    key={track.title}
                    className={index === player.trackIndex ? "current" : ""}
                    onClick={() => player.selectTrack(index)}
                    aria-pressed={index === player.trackIndex}
                  >
                    <span>0{index + 1}</span>
                    <b>{track.title}</b>
                    <small>{formatTime(track.duration)}</small>
                  </button>
                ))}
                <small className="local-audio-note">original audio synthesized locally</small>
              </div>
            </div>
          </Window>

          <Window id="journal" title="/changelog/latest.log" className="journal-window">
            <div className="journal-grid">
              <div>
                <div className="section-heading">
                  <div>
                    <span>site diary</span>
                    <h2>recent little changes</h2>
                  </div>
                  <span className="file-count">{updates.length} entries</span>
                </div>
                <ol className="update-list">
                  {updates.slice(0, showAllUpdates ? updates.length : 3).map((update) => (
                    <li key={update.date}>
                      <time>{update.date}</time>
                      <div>
                        <b>[{update.tag}]</b>
                        <p>{update.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setShowAllUpdates((value) => !value)}
                  aria-expanded={showAllUpdates}
                >
                  {showAllUpdates ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {showAllUpdates ? "fold the log away" : `read ${updates.length - 3} older notes`}
                </button>
              </div>

              <aside className="currently-card">
                <p className="side-label">currently...</p>
                <div className="mood-face" aria-hidden="true">
                  (¬‿¬)♪
                </div>
                <dl>
                  <div>
                    <dt>playing</dt>
                    <dd>nier replicant</dd>
                  </div>
                  <div>
                    <dt>collecting</dt>
                    <dd>figures & cds</dd>
                  </div>
                  <div>
                    <dt>drinking</dt>
                    <dd>cold barley tea</dd>
                  </div>
                  <div>
                    <dt>thinking</dt>
                    <dd>about old websites</dd>
                  </div>
                </dl>
                <p className="currently-note">status updated by hand, not by a widget.</p>
              </aside>
            </div>
          </Window>

          <Window id="shrine" title="/media-shrine/favorites.html" className="shrine-window">
            <div className="section-heading shrine-heading">
              <div>
                <span>things i keep thinking about</span>
                <h2>midnight media shrine</h2>
              </div>
              <button type="button" className="bevel-button" onClick={surpriseMe}>
                <Shuffle size={13} aria-hidden="true" /> surprise me
              </button>
            </div>
            <p className="section-description">
              a hand-picked shelf of strange, tender, story-heavy worlds. covers and catalogue notes are
              preserved from the original shrine.
            </p>
            <div className="filter-row" aria-label="Filter recommendations by genre">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={genre === filter ? "active" : ""}
                  onClick={() => chooseGenre(filter)}
                  aria-pressed={genre === filter}
                >
                  {filter}
                </button>
              ))}
              <span>{filteredRecommendations.length} found</span>
            </div>
            <div className="recommendation-grid">
              {filteredRecommendations.slice(0, visibleCount).map((recommendation) => {
                const originalIndex = recommendations.indexOf(recommendation);
                const selected = selectedRec === recommendation.title;
                return (
                  <article
                    id={`recommendation-${originalIndex}`}
                    key={recommendation.title}
                    className={`recommendation-card ${selected ? "selected" : ""}`}
                  >
                    <div className="cover-wrap">
                      <img src={recommendation.image} alt={`${recommendation.title} cover`} loading="lazy" />
                      {selected && <span>tonight&apos;s pick</span>}
                    </div>
                    <div className="recommendation-copy">
                      <h3>
                        {recommendation.title} <small>({recommendation.year})</small>
                      </h3>
                      <p>{recommendation.description}</p>
                      <ul aria-label="Genres">
                        {recommendation.genres.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
            {visibleCount < filteredRecommendations.length && (
              <button
                type="button"
                className="text-button show-more"
                onClick={() => setVisibleCount(filteredRecommendations.length)}
              >
                <ChevronDown size={13} /> open the rest of the shelf (
                {filteredRecommendations.length - visibleCount})
              </button>
            )}
          </Window>

          <Window id="gallery" title="/scrapbook/saved_images/" className="gallery-window">
            <div className="section-heading">
              <div>
                <span>found & lovingly saved</span>
                <h2>digital scrapbook</h2>
              </div>
              <ImageIcon size={18} aria-hidden="true" />
            </div>
            <p className="section-description">
              click an image to inspect it. use ← → to wander and esc to close the viewer.
            </p>
            <div className="gallery-grid">
              {gallery.map((item, index) => (
                <button
                  type="button"
                  className="gallery-item"
                  key={item.src}
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Enlarge ${item.title}`}
                >
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <span>
                    0{index + 1} / {item.title}
                  </span>
                </button>
              ))}
            </div>
          </Window>

          <Window id="guestbook" title="/guestbook/write_me.html" className="guestbook-window">
            <div className="section-heading">
              <div>
                <span>proof that you were here</span>
                <h2>leave a tiny letter</h2>
              </div>
              <MessageCircle size={18} aria-hidden="true" />
            </div>
            <div className="guestbook-grid">
              <form onSubmit={submitGuestbook} className="guestbook-form">
                <p>
                  no account, no server, no weird tracking. your note is stored only in this browser and
                  you can delete it whenever you like.
                </p>
                <label htmlFor="guest-name">your name / alias</label>
                <input
                  id="guest-name"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  maxLength={32}
                  placeholder="anonymous moon"
                  autoComplete="nickname"
                />
                <div className="label-row">
                  <label htmlFor="guest-message">your note</label>
                  <span>{guestMessage.length}/300</span>
                </div>
                <textarea
                  id="guest-message"
                  value={guestMessage}
                  onChange={(event) => setGuestMessage(event.target.value)}
                  maxLength={300}
                  rows={5}
                  placeholder="i wandered in from..."
                />
                <button type="submit" className="bevel-button">
                  <Send size={13} aria-hidden="true" /> pin my note
                </button>
                <p className="form-status" aria-live="polite">
                  {guestStatus}
                </p>
              </form>
              <div className="guestbook-notes" aria-live="polite">
                <div className="owner-note">
                  <b>webmaster&apos;s pin</b>
                  <p>be kind, write small, and please do not feed the pixels after midnight.</p>
                </div>
                {entries.length === 0 ? (
                  <div className="empty-notes">
                    <MessageCircle size={22} strokeWidth={1.3} aria-hidden="true" />
                    <p>the page is still blank.</p>
                    <span>your browser&apos;s first note could go here.</span>
                  </div>
                ) : (
                  <ol>
                    {entries.map((entry) => (
                      <li key={entry.id}>
                        <div className="note-meta">
                          <b>{entry.name}</b>
                          <time dateTime={entry.createdAt}>
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </time>
                          <button
                            type="button"
                            onClick={() => {
                              setEntries((current) => current.filter((item) => item.id !== entry.id));
                              setGuestStatus("your local note was removed.");
                            }}
                            aria-label={`Delete note by ${entry.name}`}
                            title="Delete this local note"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <p>{entry.message}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </Window>

          <Window id="links" title="/neighbors/button_wall.html" className="links-window">
            <div className="section-heading">
              <div>
                <span>the web is better with doors</span>
                <h2>neighbors & inspirations</h2>
              </div>
              <ExternalLink size={17} aria-hidden="true" />
            </div>
            <p className="section-description">
              real buttons, real handmade sites. hover to pause the parade; every door opens in a new tab.
            </p>
            <div className="button-marquee">
              <div className="button-marquee-track">
                <div className="button-group">
                  {neighborButtons.map((button) => (
                    <a key={button.name} href={button.href} target="_blank" rel="noreferrer" title={button.name}>
                      <img className="pixel" src={button.image} alt={`${button.name} website button`} />
                    </a>
                  ))}
                </div>
                <div className="button-group" aria-hidden="true">
                  {neighborButtons.map((button) => (
                    <span key={button.name}>
                      <img className="pixel" src={button.image} alt="" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="inspiration-links">
              <a href="https://var1ac4t.neocities.org/" target="_blank" rel="noreferrer">
                var1ac4t&apos;s palace <ExternalLink size={11} />
              </a>
              <a href="https://kyuunkurarin.neocities.org/" target="_blank" rel="noreferrer">
                kyuunkurarin <ExternalLink size={11} />
              </a>
              <a href="https://sword-of-moonlight.moe/" target="_blank" rel="noreferrer">
                sword of moonlight <ExternalLink size={11} />
              </a>
            </div>
            <div className="copy-link-row">
              <p>want to remember this room?</p>
              <button type="button" className="text-button" onClick={copyPageLink}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "link copied!" : "copy this page link"}
              </button>
            </div>
          </Window>

          <footer className="site-footer">
            <div className="footer-ornament" aria-hidden="true">
              ‧₊˚✧ ⊹ ˚ . ✧˚₊‧
            </div>
            <p>
              a dark-moe personal homepage study · original interface, borrowed pixels credited above.
            </p>
            <p>no cookies · no analytics · your letters never leave your browser</p>
            <nav aria-label="Footer navigation">
              <a href="#about">about</a>
              <a href="#guestbook">guestbook</a>
              <a href="#links">credits</a>
              <a href="#home">
                back to top <ArrowUp size={11} />
              </a>
            </nav>
          </footer>
        </main>
      </div>

      {lightboxIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Scrapbook image viewer"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
        >
          <div className="lightbox-window">
            <div className="window-title">
              <span>
                viewer / 0{lightboxIndex + 1} of 0{gallery.length}
              </span>
              <button type="button" autoFocus onClick={() => setLightboxIndex(null)} aria-label="Close image viewer">
                <X size={15} />
              </button>
            </div>
            <div className="lightbox-image-row">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)
                }
                aria-label="Previous image"
              >
                <ArrowLeft size={18} />
              </button>
              <img src={gallery[lightboxIndex].src} alt={gallery[lightboxIndex].title} />
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)}
                aria-label="Next image"
              >
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="lightbox-caption">
              <div>
                <b>{gallery[lightboxIndex].title}</b>
                <p>{gallery[lightboxIndex].caption}</p>
              </div>
              <a href={gallery[lightboxIndex].source} target="_blank" rel="noreferrer">
                original source <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
