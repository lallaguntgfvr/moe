import { ArrowRight, FolderOpen, Sparkles } from "lucide-react";
import Window from "../components/Window";
import { navigation } from "../data";

export default function HomePage() {
  return (
    <>
      <header className="hero">
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
          <span className="quote-secret">
            you found the door. please come in.
          </span>
        </div>
      </header>

      <div className="ticker" aria-label="Welcome message">
        <div className="ticker-track">
          <span>
            おかえりなさい! welcome home · this site is held together by messy
            code and scotch tape · please look around · no autoplay · take your
            time ·&nbsp;
          </span>
          <span aria-hidden="true">
            おかえりなさい! welcome home · this site is held together by messy
            code and scotch tape · please look around · no autoplay · take your
            time ·&nbsp;
          </span>
        </div>
      </div>

      <Window title="/start_here.txt" className="home-window">
        <div className="section-kicker">
          <Sparkles size={13} aria-hidden="true" /> you found the door
        </div>
        <div className="section-heading">
          <div>
            <span>おかえりなさい · welcome home</span>
            <h2>pick a little door</h2>
          </div>
          <FolderOpen size={19} aria-hidden="true" />
        </div>
        <p className="home-welcome">
          a tiny room for old games, saved pixels, and late-night thoughts.
          every corner has its own page now—wander wherever you like, and make
          yourself at home.
        </p>
        <nav className="home-directory" aria-label="Explore the room">
          {navigation
            .filter((item) => item.id !== "home")
            .map((item, index) => (
              <a
                className="directory-door"
                href={`./${item.file}`}
                key={item.id}
              >
                <span className="nav-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>
                  <b>{item.label}</b>
                  <small>{item.hint}</small>
                </span>
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            ))}
        </nav>
        <p className="home-note">
          no autoplay · no cookies · best viewed with a little insomnia
        </p>
      </Window>
    </>
  );
}
