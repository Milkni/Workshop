/**
 * Formats a given number of minutes into a human-readable Czech string.
 * Example: 22.5 -> "22 min 30 s"
 */
export function formatMinutesCzech(minutes: number): string {
  if (isNaN(minutes) || minutes <= 0) return "0 min";
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  
  if (secs === 0) {
    return `${mins} min`;
  }
  return `${mins} min ${secs} s`;
}

/**
 * Formats seconds into a MM:SS digital clock representation.
 * Example: 135 -> "02:15"
 */
export function formatDigitalClock(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
  return `${minsStr}:${secsStr}`;
}
