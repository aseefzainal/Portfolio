export function githubUsernameFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("github.com")) return "";
    return parsed.pathname.split("/").filter(Boolean)[0] ?? "";
  } catch {
    return "";
  }
}
