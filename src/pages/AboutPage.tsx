import { Sparkles } from "lucide-react";
import Window from "../components/Window";

export default function AboutPage() {
  return (
    <Window title="/about/read_me.txt" className="about-window">
      <div className="about-grid">
        <div className="intro-copy">
          <div className="section-kicker">
            <Sparkles size={13} aria-hidden="true" /> welcome to my little
            corner
          </div>
          <p className="intro-lead">
            hello! おかえりなさい! welcome to my corner of the world wide web
            held together by messy code and scotch tape.
            <img
              src="https://kyuunkurarin.neocities.org/soraaa.webp"
              alt="a tiny blue pixel friend"
            />
          </p>
          <p>
            i like to talk about games, j-fashion, my offline life, the books i
            read, photography, and i&apos;m also a collector of figures and
            cds!!
          </p>
          <hr />
          <p>
            this digital rabbithole is mainly a mishmash of things that i like,
            so the appearance won&apos;t stay consistent! ^_^ the phrase{" "}
            <b>moe moe kyun</b> comes from maid cafés—a cute little spell to
            make your food taste better.
          </p>
          <p>
            my code is still pretty newbie but it does work!! i&apos;m learning
            lots and this room is a long passion project. please feel free to
            look around :D
          </p>
          <div className="about-signoff">
            <img
              className="pixel"
              src="https://kyuunkurarin.neocities.org/bnuuy.gif"
              alt="pixel bunny"
            />
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
  );
}
