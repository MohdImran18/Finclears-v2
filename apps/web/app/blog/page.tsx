import type { Metadata } from "next";

import Hero from "@/components/blog/Hero";
import FeaturedPost from "@/components/blog/FeaturedPost";
import SearchBar from "@/components/blog/SearchBar";
import CategoryFilter from "@/components/blog/CategoryFilter";
import BlogGrid from "@/components/blog/BlogGrid";
import Newsletter from "@/components/blog/Newsletter";
import CTA from "@/components/blog/CTA";

export const metadata: Metadata = {
  title: "Business Blog | FinClears",

  description:
    "Read expert articles on Company Registration, GST, Trademark, Income Tax, ROC Compliance, Startup India and Business Growth.",

  openGraph: {
    title: "FinClears Blog",

    description:
      "Business Registration, Tax & Compliance Knowledge Center.",

    images: [
      "/images/og/blog.jpg",
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "FinClears Blog",

    description:
      "Business, GST & Tax Guides",
  },
};

export default function BlogPage() {
  return (
    <main>

      <Hero />

      <FeaturedPost />

      <SearchBar />

      <CategoryFilter />

      <BlogGrid />

      <Newsletter />

      <CTA />

    </main>
  );
}
