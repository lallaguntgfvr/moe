export function readDisplayPreference(key: string, offValue: string) {
  try {
    return localStorage.getItem(key) !== offValue;
  } catch {
    return true;
  }
}

export function readMotionPreference() {
  const systemReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  try {
    const saved = localStorage.getItem("secret-room-motion");
    if (saved === "full") return true;
    if (saved === "reduced") return false;
  } catch {
    // Fall back to the operating system preference when storage is unavailable.
  }
  return !systemReduced;
}
