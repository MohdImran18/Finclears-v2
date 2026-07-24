import api from "./index";
import API from "@/constants/api";

export const BlogApi = {
  async getAll() {
    const { data } = await api.get(
      API.BLOGS.INDEX
    );

    return data.data.blogs;
  },

  async getFeatured() {
    const { data } = await api.get(
      API.BLOGS.FEATURED
    );

    return data.data.blogs;
  },

  async getCategories() {
    const { data } = await api.get(
      API.BLOGS.CATEGORIES
    );

    return data.data.categories;
  },

  async getBySlug(
    slug: string
  ) {
    const { data } = await api.get(
      API.BLOGS.SHOW(slug)
    );

    return data.data.blog;
  },

  async search(
    query: string
  ) {
    const { data } = await api.get(
      `${API.BLOGS.SEARCH}?q=${encodeURIComponent(query)}`
    );

    return data.data.blogs;
  },
};

export default BlogApi;
