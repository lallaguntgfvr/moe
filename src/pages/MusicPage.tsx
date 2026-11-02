import {
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Window from "../components/Window";
import { tracks } from "../data";
import { formatTime, useSynthPlayer } from "../useSynthPlayer";

export default function MusicPage() {
  const player = useSynthPlayer();

  return (
    <Window title="/now-playing.exe" className="music-window">
      <div className="player-layout">
        <div
          className={`disc-wrap ${player.isPlaying ? "playing" : ""}`}
          aria-hidden="true"
        >
          <div className="disc">
            <span>0{player.trackIndex + 1}</span>
          </div>
          <Music2 size={15} />
        </div>
        <div className="player-main">
          <p className="player-label">
            now {player.isPlaying ? "playing" : "paused"}
          </p>
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
              {formatTime(player.position)} /{" "}
              {formatTime(player.track.duration)}
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
              {player.volume > 0 ? (
                <Volume2 size={14} />
              ) : (
                <VolumeX size={14} />
              )}
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
          <small className="local-audio-note">
            original audio synthesized locally
          </small>
        </div>
      </div>
      <p className="music-page-note">
        a little company for your stay. nothing plays until you press play, and
        the radio stops when you visit another page. your volume preference
        comes with you.
      </p>
    </Window>
  );
}
