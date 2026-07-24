import type { Service } from "@/types/service";

export const services: Service[] = [
  {
    id: 1,
    title: "Private Limited Company",
    slug: "private-limited-company",
    category: {
  id: 1,
  name: "Start Business",
  slug: "start-business",
},
    short_description:
      "Register your Private Limited Company quickly and compliantly.",
    description:
      "Complete Private Limited Company registration with expert CA support.",
    starting_price: 6999,
    price_label: "Starting at ₹6,999",
    featured_image: "/images/services/private-limited-company.webp",
    icon: "/icons/private-company.svg",
    is_featured: true,
    is_popular: true,
    seo_title: "Private Limited Company Registration",
    seo_description:
      "Register your Private Limited Company online with FinClears.",
  },

  {
    id: 2,
    title: "LLP Registration",
    slug: "llp-registration",
    category: {
  id: 1,
  name: "Start Business",
  slug: "start-business",
},
    short_description:
      "Limited Liability Partnership Registration.",
    description:
      "Fast LLP registration with MCA filing.",
    starting_price: 4999,
    price_label: "Starting at ₹4,999",
    featured_image: "/images/services/llp.webp",
    icon: "/icons/llp.svg",
    is_featured: true,
    is_popular: false,
    seo_title: "LLP Registration",
    seo_description:
      "Register LLP online with FinClears.",
  },

  {
    id: 3,
    title: "GST Registration",
    slug: "gst-registration",
    category: {
  id: 2,
  name: "Tax Compliance",
  slug: "tax-compliance",
},
    short_description:
      "Online GST Registration.",
    description:
      "GST registration with expert guidance.",
    starting_price: 999,
    price_label: "Starting at ₹999",
    featured_image: "/images/services/gst.webp",
    icon: "/icons/gst.svg",
    is_featured: true,
    is_popular: true,
    seo_title: "GST Registration",
    seo_description:
      "Apply for GST Registration online.",
  },

  {
    id: 4,
    title: "Trademark Registration",
    slug: "trademark-registration",
    category: {
  id: 3,
  name: "Trademark & IP",
  slug: "trademark-ip",
},
    short_description:
      "Protect your brand.",
    description:
      "Trademark registration with legal experts.",
    starting_price: 1499,
    price_label: "Starting at ₹1,499",
    featured_image: "/images/services/trademark.webp",
    icon: "/icons/trademark.svg",
    is_featured: true,
    is_popular: true,
    seo_title: "Trademark Registration",
    seo_description:
      "Trademark registration in India.",
  },

  {
    id: 5,
    title: "Payroll Management",
    slug: "payroll-management",
    category: {
  id: 4,
  name: "Payroll",
  slug: "payroll",
},
    short_description:
      "Complete payroll management.",
    description:
      "Payroll processing for startups and companies.",
    starting_price: 1999,
    price_label: "Starting at ₹1,999",
    featured_image: "/images/services/payroll.webp",
    icon: "/icons/payroll.svg",
    is_featured: false,
    is_popular: false,
    seo_title: "Payroll Services",
    seo_description:
      "Payroll outsourcing and compliance.",
  },
];

export default services;

