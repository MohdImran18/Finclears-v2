export const websiteSchema = {
  "@context": "https://schema.org",

  "@type": "WebSite",

  name: "FinClears",

  url: "https://finclears.com",

  potentialAction: {
    "@type": "SearchAction",

    target:
      "https://finclears.com/search?q={search_term_string}",

    "query-input":
      "required name=search_term_string",
  },
};
