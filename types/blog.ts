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

  featured_image: string | null;

  reading_time: string;

  author_name: string;

  published_at: string;

  created_at: string;

  updated_at: string;

  views: number;

  is_featured: boolean;

  status: boolean;

  meta_title: string;

  meta_description: string;

  meta_keywords: string;

  category: BlogCategory;

  headings?: BlogHeading[];

  tags?: BlogTag[];

  comments?: BlogComment[];
}