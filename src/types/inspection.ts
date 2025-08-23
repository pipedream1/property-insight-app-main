
export interface InspectionType {
  id: string;
  component_type: string;
  component_name: string;
  condition: string;
  created_at: string;
  comment?: string;
  photo_url: string | null;
}
