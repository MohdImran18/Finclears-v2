import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://finclears.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Skip dynamic API calls during GitHub Actions build
  if (process.env.GITHUB_ACTIONS === "true") {
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
      },
      {
        url: `${BASE_URL}/services`,
        lastModified: new Date(),
      },
      {
        url: `${BASE_URL}/blog`,
        lastModified: new Date(),
      },
      {
        url: `${BASE_URL}/contact`,
        lastModified: new Date(),
      },
    ];
  }

  // Production sitemap
  const services = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/services`,
    { next: { revalidate: 3600 } }
  )
    .then(r => (r.ok ? r.json() : { data: { services: [] } }))
    .catch(() => ({ data: { services: [] } }));

  const blogs = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/blogs`,
    { next: { revalidate: 3600 } }
  )
    .then(r => (r.ok ? r.json() : { data: { blogs: [] } }))
    .catch(() => ({ data: { blogs: [] } }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    ...services.data.services.map((s: any) => ({
      url: `${BASE_URL}/services/${s.category.slug}/${s.slug}`,
      lastModified: new Date(s.updated_at),
    })),
    ...blogs.data.blogs.map((b: any) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: new Date(b.updated_at),
    })),
  ];
}