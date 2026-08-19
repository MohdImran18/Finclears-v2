export interface Blog {
  id: number;
  blog_category_id: number;
  user_id?: number | null;
  title: string;
  slug: string;
  featured_image?: string | null;
  excerpt?: string | null;
  content: string;
  reading_time?: number | null;
  author_name?: string | null;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  views: number;
  is_featured: boolean;
  status: boolean;
  created_at?: string;
  updated_at?: string;
  category?: {
    id: number;
    name: string;
  } | null;
}

export interface BlogPayload {
  blog_category_id: number;
  user_id?: number | null;
  title: string;
  slug: string;
  featured_image?: string | null;
  excerpt?: string | null;
  content: string;
  reading_time?: number | null;
  author_name?: string | null;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  is_featured?: boolean;
  status?: boolean;
}

export interface BlogListResponse {
  success: boolean;
  message: string;
  data: {
    blogs: Blog[];
  };
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}
