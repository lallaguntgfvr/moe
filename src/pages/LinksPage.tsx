import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import Window from "../components/Window";
import { neighborButtons } from "../data";

export default function LinksPage() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const copyPageLink = async () => {
    const link = new URL(window.location.href);
    link.hash = "";
    let success = false;
    try {
      await navigator.clipboard.writeText(link.href);
      success = true;
    } catch {
      const field = document.createElement("textarea");
      field.value = link.href;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        success = document.execCommand("copy");
      } catch {
        success = false;
      }
      field.remove();
    }
    setCopyStatus(success ? "copied" : "failed");
    window.setTimeout(() => setCopyStatus("idle"), 2200);
  };

  return (
    <Window title="/neighbors/button_wall.html" className="links-window">
      <div className="section-heading">
        <div>
          <span>the web is better with doors</span>
          <h2>neighbors & inspirations</h2>
        </div>
        <ExternalLink size={17} aria-hidden="true" />
      </div>
      <p className="section-description">
        real buttons, real handmade sites. hover to pause the parade; every door
        opens in a new tab.
      </p>
      <div className="button-marquee">
        <div className="button-marquee-track">
          <div className="button-group">
            {neighborButtons.map((button) => (
              <a
                key={button.name}
                href={button.href}
                target="_blank"
                rel="noreferrer"
                title={button.name}
              >
                <img
                  className="pixel"
                  src={button.image}
                  alt={`${button.name} website button`}
                />
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
        <a
          href="https://var1ac4t.neocities.org/"
          target="_blank"
          rel="noreferrer"
        >
          var1ac4t&apos;s palace <ExternalLink size={11} />
        </a>
        <a
          href="https://kyuunkurarin.neocities.org/"
          target="_blank"
          rel="noreferrer"
        >
          kyuunkurarin <ExternalLink size={11} />
        </a>
        <a
          href="https://sword-of-moonlight.moe/"
          target="_blank"
          rel="noreferrer"
        >
          sword of moonlight <ExternalLink size={11} />
        </a>
      </div>
      <div className="copy-link-row">
        <p>want to remember this room?</p>
        <button type="button" className="text-button" onClick={copyPageLink}>
          {copyStatus === "copied" ? <Check size={13} /> : <Copy size={13} />}
          {copyStatus === "copied"
            ? "link copied!"
            : copyStatus === "failed"
              ? "please copy the address above"
              : "copy this page link"}
        </button>
      </div>
    </Window>
  );
}
