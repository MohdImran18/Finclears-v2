import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/dashboard",
        "/api",
      ],
    },

    sitemap:
      "https://finclears.com/sitemap.xml",

    host:
      "https://finclears.com",
  };
}
