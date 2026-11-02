import { MessageCircle, Send, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import Window from "../components/Window";

type GuestEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

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

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestEntry[]>(readGuestbook);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestStatus, setGuestStatus] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(guestbookKey, JSON.stringify(entries));
    } catch {
      // The guestbook still works for this session if storage is unavailable.
    }
  }, [entries]);

  const submitGuestbook = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = guestName.trim();
    const message = guestMessage.trim();
    if (!name || !message) {
      setGuestStatus("please write both a name and a tiny note.");
      return;
    }
    const entry: GuestEntry = {
      id:
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : String(Date.now()),
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    setEntries((current) => [entry, ...current]);
    setGuestMessage("");
    setGuestStatus(
      "your note is saved in this browser. thank you for stopping by!",
    );
  };

  return (
    <Window title="/guestbook/write_me.html" className="guestbook-window">
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
            no account, no server, no weird tracking. your note is stored only
            in this browser and you can delete it whenever you like.
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
            <p>
              be kind, write small, and please do not feed the pixels after
              midnight.
            </p>
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
                        setEntries((current) =>
                          current.filter((item) => item.id !== entry.id),
                        );
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
  );
}
