export interface TableTemplate {
  id: string;
  description: string;
  originalId: string;
  width: number;
  notSortable?: boolean;
  notShow?: boolean;
  dataType?: 'number' | 'string';
}
