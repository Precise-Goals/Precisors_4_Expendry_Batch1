export default function sitemap() {
  const baseUrl = "https://expendry.mstblockchain.com";
  const routes = [
    "",
    "/about",
    "/blueprints",
    "/chat",
    "/community",
    "/experience",
    "/heritage",
    "/login",
    "/marketplace",
    "/onboarding",
    "/partners",
    "/patent",
    "/privacy",
    "/showcase",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
    images: [`${baseUrl}/logo1to1.png`],
  }));
}
