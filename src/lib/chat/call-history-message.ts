export const VIDEO_CALL_HISTORY_PREFIX = "[video-call]";

export function isVideoCallHistoryMessage(body: string): boolean {
  return body.startsWith(VIDEO_CALL_HISTORY_PREFIX);
}

export function getVideoCallHistoryLabel(body: string): string {
  return body.slice(VIDEO_CALL_HISTORY_PREFIX.length).trim();
}

export function buildVideoCallHistoryBody(label: string): string {
  return `${VIDEO_CALL_HISTORY_PREFIX} ${label}`;
}

export function formatCallDuration(totalSeconds: number): string {
  const seconds = Math.max(0, totalSeconds);
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (remainder === 0) return `${minutes} min`;
  return `${minutes} min ${remainder} sec`;
}
