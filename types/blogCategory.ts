/**
 * ==========================================================
 * FinClears V2
 * Blog Category Type
 * ==========================================================
 */

export interface BlogCategory {
  id: number;

  name: string;

  slug: string;

  description?: string | null;

  icon?: string | null;

  image?: string | null;

  meta_title?: string | null;

  meta_description?: string | null;

  sort_order?: number;

  status?: boolean;

  created_at?: string;

  updated_at?: string;
}