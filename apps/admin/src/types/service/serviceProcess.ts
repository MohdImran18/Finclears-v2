export interface ServiceProcess {
  id: number;
  service_id: number;
  step_number: number;
  title: string;
  description: string;
  icon?: string | null;
  sort_order: number;
  status: boolean;
}

export interface ServiceProcessPayload {
  step_number: number;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  status: boolean;
}