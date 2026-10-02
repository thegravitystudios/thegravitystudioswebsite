import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.thegravitystudios.com";

  const routes = [
    "",
    "/about",
    "/services",
    "/work",
    "/contact",
    "/ai-production",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/services" || route === "/work" ? 0.9 : 0.8,
  }));
}
