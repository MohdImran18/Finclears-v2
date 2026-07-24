import type { MetadataRoute } from "next";

interface ServiceCategory {
  slug: string;
}

interface SitemapService {
  slug: string;
  updated_at: string;
  category: ServiceCategory;
}

interface SitemapBlog {
  slug: string;
  updated_at: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://finclears.com";

async function getServices(): Promise<SitemapService[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/services`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    const json = await res.json();

    return (json.data?.services ??
      []) as SitemapService[];
  } catch {
    return [];
  }
}

async function getBlogs(): Promise<SitemapBlog[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/blogs`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    const json = await res.json();

    return (json.data?.blogs ??
      []) as SitemapBlog[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, blogs] =
    await Promise.all([
      getServices(),
      getBlogs(),
    ]);

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    ...services.map((service) => ({
      url: `${BASE_URL}/services/${service.category.slug}/${service.slug}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...blogs.map((blog) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}