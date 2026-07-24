
import api from "./index";
import API from "@/constants/api";


export const ServiceApi = {
  /**
   * Get all services
   */
  async getAll() {
    const { data } = await api.get(
      API.SERVICES.INDEX
    );

    return data.data.services;
  },

  /**
   * Get featured services
   */
  async getFeatured() {
    const { data } = await api.get(
      API.SERVICES.FEATURED
    );

    return data.data.services;
  },

  /**
   * Get service categories
   */
  async getCategories() {
    const { data } = await api.get(
      API.SERVICES.CATEGORIES
    );

    return data.data.categories;
  },

  /**
   * Get service by slug
   */
  async getBySlug(
    slug: string
  ) {
    const { data } = await api.get(
      API.SERVICES.SHOW(slug)
    );

    return data.data.service;
  },

  /**
   * Search services
   */
  async search(
    query: string
  ) {
    const { data } = await api.get(
      `${API.SERVICES.SEARCH}?q=${encodeURIComponent(query)}`
    );

    return data.data.services;
  },
};

export default ServiceApi;
