export function serviceSchema({
  name,
  description,
  url,
  image,
  price,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
}) {
  return {
    "@context": "https://schema.org",

    "@type": "Service",

    name,

    description,

    url,

    image,

    provider: {
      "@type": "Organization",

      name: "FinClears",

      url: "https://finclears.com",
    },

    areaServed: {
      "@type": "Country",

      name: "India",
    },

    offers: price
      ? {
          "@type": "Offer",

          price,

          priceCurrency: "INR",

          availability:
            "https://schema.org/InStock",
        }
      : undefined,
  };
}
