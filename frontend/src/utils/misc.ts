export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toTimeDescription(timestamp: number): string {
  const now = (Date.now() / 1000) | 0;

  const timeElapsed = now - timestamp;

  if (timeElapsed < 60) {
    return "less than a minute ago";
  }

  if (timeElapsed < 3600) {
    const minutesElapsed = Math.floor(timeElapsed / 60);
    if (minutesElapsed === 1) {
      return "1 minute ago";
    }
    return `${minutesElapsed} minutes ago`;
  }

  if (timeElapsed < 3600 * 24) {
    const hoursElapsed = Math.floor(timeElapsed / 3600);
    if (hoursElapsed === 1) {
      return "1 hour ago";
    }
    return `${hoursElapsed} hours ago`;
  }

  const daysElapsed = Math.floor(timeElapsed / 3600 / 24);
  if (daysElapsed === 1) {
    return "1 day ago";
  }

  return `${daysElapsed} days ago`;
}

export function trimAddressForDisplay(address: string): string {
  return address.substring(0, 6) + "..." + address.substring(38);
}

export function getAddressPrefix(address: string): string {
  return address.substring(0, 5);
}
