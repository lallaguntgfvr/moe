/* midnight fm: three tiny loops made with the Web Audio API.
   the radio lives in a little widget in the corner of every page, and it
   remembers your track, your place in it, and your volume as you wander. */

(function () {
  "use strict";

  var tracks = [
    {
      title: "plastic moon",
      subtitle: "original loop 001 / browser synth",
      bpm: 82,
      duration: 32,
      root: 130.81,
      notes: [261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66, 392.0,
              440.0, 523.25, 392.0, 329.63, 293.66, 261.63, 220.0, 329.63]
    },
    {
      title: "memory card lullaby",
      subtitle: "original loop 002 / browser synth",
      bpm: 72,
      duration: 32,
      root: 110.0,
      notes: [220.0, 261.63, 329.63, 392.0, 329.63, 261.63, 246.94, 293.66,
              369.99, 440.0, 369.99, 293.66, 220.0, 261.63, 329.63, 261.63]
    },
    {
      title: "dial-up daydream",
      subtitle: "original loop 003 / browser synth",
      bpm: 94,
      duration: 32,
      root: 146.83,
      notes: [293.66, 369.99, 440.0, 587.33, 440.0, 369.99, 329.63, 415.3,
              493.88, 659.25, 493.88, 415.3, 293.66, 349.23, 440.0, 349.23]
    }
  ];

  var widget = document.getElementById("music-widget");
  if (!widget) return;

  var panel = document.getElementById("music-widget-panel");
  var toggleButton = document.getElementById("widget-toggle");
  var openRadioButton = document.getElementById("open-radio");
  var playButton = document.getElementById("play-toggle");
  var playIcon = document.getElementById("play-icon");
  var barTitle = document.getElementById("widget-title");
  var discWrap = document.getElementById("disc-wrap");
  var discNumber = document.getElementById("disc-number");
  var label = document.getElementById("player-label");
  var title = document.getElementById("track-title");
  var subtitle = document.getElementById("track-subtitle");
  var previousButton = document.getElementById("previous-track");
  var nextButton = document.getElementById("next-track");
  var timeReadout = document.getElementById("time-readout");
  var seek = document.getElementById("seek");
  var muteButton = document.getElementById("mute-toggle");
  var volumeIcon = document.getElementById("volume-icon");
  var volumeSlider = document.getElementById("volume");
  var volumeReadout = document.getElementById("volume-readout");
  var errorLabel = document.getElementById("player-error");
  var trackButtons = Array.prototype.slice.call(
    document.querySelectorAll(".widget-playlist button[data-track]")
  );

  var trackIndex = 0;
  var isPlaying = false;
  var wantsPlay = false; /* the visitor asked for music, even if the browser said no */
  var position = 0;
  var volume = readVolume();
  var context = null;
  var gain = null;
  var source = null;
  var anchor = 0;
  var ticker = 0;
  var buffers = {};

  /* ---------- remembered bits ---------- */

  function readVolume() {
    try {
      var saved = localStorage.getItem("secret-room-volume");
      if (saved === null) return 0.55;
      var parsed = Number(saved);
      return parsed >= 0 && parsed <= 1 ? parsed : 0.55;
    } catch (error) {
      return 0.55;
    }
  }

  function storeVolume() {
    try {
      localStorage.setItem("secret-room-volume", String(volume));
    } catch (error) {
      /* the volume still works for this visit */
    }
  }

  function readRadio() {
    var radio = { track: 0, position: 0, playing: false };
    try {
      var raw = sessionStorage.getItem("secret-room-radio");
      if (!raw) return radio;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return radio;
      if (isFinite(parsed.track)) {
        var index = Math.round(Number(parsed.track));
        if (index >= 0 && index < tracks.length) radio.track = index;
      }
      if (isFinite(parsed.position)) {
        var place = Number(parsed.position);
        if (place >= 0) radio.position = place % tracks[radio.track].duration;
      }
      radio.playing = parsed.playing === true;
    } catch (error) {
      /* no memory, no problem */
    }
    return radio;
  }

  function storeRadio() {
    try {
      sessionStorage.setItem(
        "secret-room-radio",
        JSON.stringify({
          track: trackIndex,
          position: Math.round(position * 10) / 10,
          playing: isPlaying || wantsPlay
        })
      );
    } catch (error) {
      /* the radio still plays for this page */
    }
  }

  function readOpen() {
    try {
      return sessionStorage.getItem("secret-room-radio-open") === "1";
    } catch (error) {
      return false;
    }
  }

  function storeOpen(open) {
    try {
      sessionStorage.setItem("secret-room-radio-open", open ? "1" : "0");
    } catch (error) {
      /* folding still works */
    }
  }

  /* ---------- small helpers ---------- */

  function formatTime(value) {
    if (!isFinite(value)) return "0:00";
    var minutes = Math.floor(value / 60);
    var seconds = Math.floor(value % 60);
    return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
  }

  function showError(message) {
    if (!errorLabel) return;
    errorLabel.textContent = message;
    errorLabel.hidden = !message;
  }

  function makeLoop(track) {
    var sampleRate = context.sampleRate;
    var size = Math.floor(sampleRate * track.duration);
    var buffer = context.createBuffer(1, size, sampleRate);
    var channel = buffer.getChannelData(0);
    var stepLength = 60 / track.bpm / 2;

    for (var i = 0; i < size; i += 1) {
      var time = i / sampleRate;
      var step = Math.floor(time / stepLength);
      var phase = (time - step * stepLength) / stepLength;
      var frequency = track.notes[step % track.notes.length];
      var envelope = Math.exp(-phase * 5.4) * (1 - Math.exp(-phase * 90));
      var vibrato = 1 + Math.sin(time * Math.PI * 8) * 0.0015;
      var bell =
        Math.sin(Math.PI * 2 * frequency * vibrato * time) * 0.13 +
        Math.sin(Math.PI * 4 * frequency * time) * 0.022;
      var pad =
        Math.sin(Math.PI * 2 * track.root * time) * 0.022 +
        Math.sin(Math.PI * 3 * track.root * time) * 0.014;
      var fade = Math.max(
        0,
        Math.min(1, time / 0.05, (track.duration - time) / 0.05)
      );
      channel[i] = (bell * envelope + pad) * fade;
    }

    return buffer;
  }

  function stopSource() {
    window.clearInterval(ticker);
    if (source) {
      try {
        source.stop();
      } catch (error) {
        /* it may already be stopped */
      }
      source.disconnect();
      source = null;
    }
  }

  function startSource() {
    stopSource();

    var track = tracks[trackIndex];
    source = context.createBufferSource();
    source.buffer = buffers[trackIndex];
    source.loop = true;
    source.connect(gain);
    source.start(0, position % track.duration);

    anchor = context.currentTime - position;
    ticker = window.setInterval(function () {
      position = (context.currentTime - anchor) % track.duration;
      renderTime();
    }, 100);
  }

  function ensureContext() {
    if (context) {
      if (typeof context.resume === "function") context.resume();
      return true;
    }
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      showError("audio does not work in this browser");
      return false;
    }
    try {
      context = new AudioContextClass();
      gain = context.createGain();
      gain.gain.value = volume;
      gain.connect(context.destination);
    } catch (error) {
      showError("audio could not start in this browser");
      context = null;
      gain = null;
      return false;
    }
    if (typeof context.resume === "function") context.resume();
    return true;
  }

  /* ---------- playing ---------- */

  function play() {
    if (!ensureContext()) return;
    if (!buffers[trackIndex]) buffers[trackIndex] = makeLoop(tracks[trackIndex]);

    try {
      startSource();
      isPlaying = true;
      wantsPlay = true;
      showError("");
      render();
      storeRadio();
    } catch (error) {
      showError("audio could not start in this browser");
      isPlaying = false;
      render();
    }
  }

  function pause() {
    stopSource();
    isPlaying = false;
    wantsPlay = false;
    render();
    storeRadio();
  }

  function attemptResume() {
    if (!ensureContext()) return;
    play();
    /* most browsers keep a fresh page silent until a real click. if the
       audio never started, stop pretending and wait for one. */
    window.setTimeout(function () {
      if (!context || !isPlaying) return;
      if (context.state === "running") return;
      stopSource();
      isPlaying = false;
      wantsPlay = true;
      render();
    }, 450);
  }

  function selectTrack(index) {
    var next = (index + tracks.length) % tracks.length;
    var wasPlaying = isPlaying;
    position = 0;
    trackIndex = next;
    if (wasPlaying) {
      if (buffers[trackIndex] === undefined) {
        buffers[trackIndex] = makeLoop(tracks[trackIndex]);
      }
      startSource();
    }
    render();
    storeRadio();
  }

  /* ---------- drawing ---------- */

  function renderTime() {
    var track = tracks[trackIndex];
    if (timeReadout) {
      timeReadout.textContent =
        formatTime(position) + " / " + formatTime(track.duration);
    }
    if (seek) seek.value = String(Math.min(position, track.duration));
  }

  function renderVolume() {
    if (volumeSlider) volumeSlider.value = String(volume);
    if (volumeReadout) volumeReadout.textContent = Math.round(volume * 100) + "%";
    if (volumeIcon) volumeIcon.textContent = volume > 0 ? "♪" : "✕";
    if (muteButton) {
      muteButton.setAttribute(
        "aria-label",
        volume > 0 ? "Mute music" : "Unmute music"
      );
    }
  }

  function setVolume(next) {
    volume = Math.max(0, Math.min(1, next));
    storeVolume();
    if (gain && context) {
      gain.gain.setTargetAtTime(volume, context.currentTime, 0.02);
    }
    renderVolume();
  }

  function render() {
    var track = tracks[trackIndex];
    var number = "0" + (trackIndex + 1);

    if (title) title.textContent = track.title;
    if (barTitle) barTitle.textContent = track.title;
    if (subtitle) subtitle.textContent = track.subtitle;
    if (discNumber) discNumber.textContent = number;
    if (label) {
      label.textContent = isPlaying
        ? "now playing"
        : wantsPlay
          ? "paused · press play again"
          : "now paused";
    }
    if (playIcon) playIcon.textContent = isPlaying ? "❚❚" : "▶";
    playButton.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
    playButton.setAttribute("title", isPlaying ? "Pause music" : "Play music");
    if (discWrap) discWrap.classList.toggle("playing", isPlaying);
    if (seek) seek.max = String(track.duration);

    trackButtons.forEach(function (button, index) {
      var current = index === trackIndex;
      button.classList.toggle("current", current);
      button.setAttribute("aria-pressed", String(current));
    });

    renderTime();
    renderVolume();
  }

  function setOpen(open) {
    widget.classList.toggle("is-open", open);
    if (panel) panel.hidden = !open;
    if (toggleButton) {
      toggleButton.setAttribute("aria-expanded", String(open));
      toggleButton.setAttribute("title", open ? "Fold the radio away" : "Open the radio");
    }
    storeOpen(open);
  }

  /* ---------- wiring ---------- */

  playButton.addEventListener("click", function () {
    if (isPlaying) pause();
    else play();
  });

  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      setOpen(!widget.classList.contains("is-open"));
    });
  }

  if (openRadioButton) {
    openRadioButton.addEventListener("click", function () {
      setOpen(true);
      if (playButton) playButton.focus();
    });
  }

  if (previousButton) {
    previousButton.addEventListener("click", function () {
      selectTrack(trackIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      selectTrack(trackIndex + 1);
    });
  }

  trackButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectTrack(Number(button.getAttribute("data-track")));
    });
  });

  if (seek) {
    seek.addEventListener("input", function () {
      position = Number(seek.value);
      if (isPlaying) startSource();
      renderTime();
    });
    seek.addEventListener("change", function () {
      storeRadio();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", function () {
      setVolume(Number(volumeSlider.value));
    });
  }

  if (muteButton) {
    muteButton.addEventListener("click", function () {
      setVolume(volume > 0 ? 0 : 0.55);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (!widget.classList.contains("is-open")) return;
    if (!widget.contains(document.activeElement)) return;
    setOpen(false);
    if (toggleButton) toggleButton.focus();
  });

  /* ---------- carrying the radio between rooms ---------- */

  window.addEventListener("pagehide", function () {
    storeRadio();
    stopSource();
    if (context && typeof context.close === "function") {
      try {
        context.close();
      } catch (error) {
        /* closing is a courtesy */
      }
    }
    context = null;
    gain = null;
  });

  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    /* the browser stashed this page before we closed the audio */
    var wasPlaying = isPlaying;
    stopSource();
    isPlaying = false;
    if (wasPlaying) wantsPlay = true;
    render();
    if (wantsPlay) attemptResume();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") storeRadio();
  });

  /* ---------- first paint ---------- */

  var remembered = readRadio();
  trackIndex = remembered.track;
  position = remembered.position;
  wantsPlay = remembered.playing;

  setOpen(readOpen());
  render();

  if (wantsPlay) attemptResume();
})();
