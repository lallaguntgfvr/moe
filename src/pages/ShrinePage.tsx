import { ChevronDown, Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import Window from "../components/Window";
import { recommendations } from "../data";
import { readMotionPreference } from "../preferences";

const filters = ["all", "jrpg", "visual novel", "dungeon crawler", "horror"];

export default function ShrinePage() {
  const [genre, setGenre] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedRec, setSelectedRec] = useState("");

  const filteredRecommendations = useMemo(
    () =>
      genre === "all"
        ? recommendations
        : recommendations.filter((recommendation) =>
            recommendation.genres.includes(genre),
          ),
    [genre],
  );

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
      document
        .getElementById(`recommendation-${originalIndex}`)
        ?.scrollIntoView({
          behavior: readMotionPreference() ? "smooth" : "auto",
          block: "center",
        });
    }, 60);
  };

  return (
    <Window title="/media-shrine/favorites.html" className="shrine-window">
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
        a hand-picked shelf of strange, tender, story-heavy worlds. covers and
        catalogue notes are preserved from the original shrine.
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
        {filteredRecommendations
          .slice(0, visibleCount)
          .map((recommendation) => {
            const originalIndex = recommendations.indexOf(recommendation);
            const selected = selectedRec === recommendation.title;
            return (
              <article
                id={`recommendation-${originalIndex}`}
                key={recommendation.title}
                className={`recommendation-card ${selected ? "selected" : ""}`}
              >
                <div className="cover-wrap">
                  <img
                    src={recommendation.image}
                    alt={`${recommendation.title} cover`}
                    loading="lazy"
                  />
                  {selected && <span>tonight&apos;s pick</span>}
                </div>
                <div className="recommendation-copy">
                  <h3>
                    {recommendation.title}{" "}
                    <small>({recommendation.year})</small>
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
  );
}
