const DURATION_PATTERN = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;

export function parseDuration(input: string): number {
  const match = DURATION_PATTERN.exec(input);
  const [, hours, minutes, seconds] = match ?? [];

  if (hours === undefined && minutes === undefined && seconds === undefined) {
    throw new Error(
      `Invalid duration: "${input}". Expected a string like "2h30m" or "45s".`,
    );
  }

  const minutesValue = Number(minutes ?? 0);
  const secondsValue = Number(seconds ?? 0);

  if (minutesValue >= 60 || secondsValue >= 60) {
    throw new Error(
      `Invalid duration: "${input}". Minutes and seconds must each be less than 60.`,
    );
  }

  return (Number(hours ?? 0) * 3600 + minutesValue * 60 + secondsValue) * 1000;
}
