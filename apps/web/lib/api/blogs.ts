import api, { API } from "./index";

export const BlogApi = {
  async getAll() {
    const { data } = await api.get(API.BLOGS);

    return data.data.blogs;
  },

  async getFeatured() {
    const { data } = await api.get(
      API.FEATURED_BLOGS
    );

    return data.data.blogs;
  },

  async getBySlug(slug: string) {
    const { data } = await api.get(
      `${API.BLOG_DETAILS}/${slug}`
    );

    return data.data.blog;
  },

  async getRelated(slug: string) {
    const { data } = await api.get(
      `${API.BLOG_DETAILS}/${slug}/related`
    );

    return data.data.blogs;
  },
};
