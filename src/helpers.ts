export function isSiteBlocked(hostsText: string, url: string) {
  if (!hostsText.trim()) {
    return false;
  }
  const blockedHosts =  hostsText.split("\n").map((line) => line.trim())
  console.log('blocked: ', blockedHosts, "host: ", new URL(url).host);
  return blockedHosts.some((h) => url.match(h));
}
