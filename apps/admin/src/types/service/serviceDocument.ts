export interface ServiceDocument {
  id: number;
  service_id: number;
  document_name: string;
  description?: string | null;
  is_required: boolean;
  sort_order: number;
  status: boolean;
}

export interface ServiceDocumentPayload {
  document_name: string;
  description?: string | null;
  is_required: boolean;
  sort_order: number;
  status: boolean;
}