import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Window from "../components/Window";
import { gallery } from "../data";

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const isOpen = lightboxIndex !== null;

  const openImage = (index: number) => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setLightboxIndex(index);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setLightboxIndex((current) =>
          current === null ? 0 : (current + 1) % gallery.length,
        );
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLightboxIndex((current) =>
          current === null
            ? 0
            : (current - 1 + gallery.length) % gallery.length,
        );
      }
      if (event.key === "Tab") {
        const controls =
          viewerRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      openerRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <Window title="/scrapbook/saved_images/" className="gallery-window">
        <div className="section-heading">
          <div>
            <span>found & lovingly saved</span>
            <h2>digital scrapbook</h2>
          </div>
          <ImageIcon size={18} aria-hidden="true" />
        </div>
        <p className="section-description">
          click an image to inspect it. use ← → to wander and esc to close the
          viewer.
        </p>
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <button
              type="button"
              className="gallery-item"
              key={item.src}
              onClick={() => openImage(index)}
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
          <div className="lightbox-window" ref={viewerRef} tabIndex={-1}>
            <div className="window-title">
              <span>
                viewer / 0{lightboxIndex + 1} of 0{gallery.length}
              </span>
              <button
                type="button"
                autoFocus
                onClick={() => setLightboxIndex(null)}
                aria-label="Close image viewer"
              >
                <X size={15} />
              </button>
            </div>
            <div className="lightbox-image-row">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + gallery.length) % gallery.length,
                  )
                }
                aria-label="Previous image"
              >
                <ArrowLeft size={18} />
              </button>
              <img
                src={gallery[lightboxIndex].src}
                alt={gallery[lightboxIndex].title}
              />
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % gallery.length)
                }
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
              <a
                href={gallery[lightboxIndex].source}
                target="_blank"
                rel="noreferrer"
              >
                original source <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
