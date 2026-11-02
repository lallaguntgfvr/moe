import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Window from "../components/Window";
import { updates } from "../data";

export default function JournalPage() {
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  return (
    <Window title="/changelog/latest.log" className="journal-window">
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
            {updates
              .slice(0, showAllUpdates ? updates.length : 3)
              .map((update) => (
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
            {showAllUpdates ? (
              <ChevronUp size={13} />
            ) : (
              <ChevronDown size={13} />
            )}
            {showAllUpdates
              ? "fold the log away"
              : `read ${updates.length - 3} older notes`}
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
          <p className="currently-note">
            status updated by hand, not by a widget.
          </p>
        </aside>
      </div>
    </Window>
  );
}
