export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogComment {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}

export interface BlogHeading {
  id: string;
  title: string;
}

export interface Blog {
  id: number;

  title: string;
  slug: string;

  excerpt: string;
  content: string;

  featured_image?: string | null;

  reading_time?: string | null;

  author_name?: string | null;

  published_at: string;

  created_at: string;

  updated_at?: string | null;

  views: number;

  is_featured: boolean;

  status: boolean;

  meta_title?: string | null;

  meta_description?: string | null;

  meta_keywords?: string | null;

  category?: BlogCategory | null;

  headings?: BlogHeading[];

  tags?: BlogTag[];

  comments?: BlogComment[];
}

export interface BlogListResponse {
  data: Blog[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface BlogResponse {
  data: Blog;
}