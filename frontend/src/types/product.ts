import { Status } from './status';

export type ProductPermissions = {
  update: boolean;
  inactivate: boolean;
  reactivate: boolean;
  delete: boolean;
  restore: boolean;
  force_delete: boolean;
};

export type ProductCompany = {
  id: number;
  name: string;
  status: Status;
  is_trashed: boolean;
};

export type Product = {
  id: number;
  company_id: number;
  company: ProductCompany | null;
  name: string;
  description: string | null;
  price: string;
  internal_code: string;
  status: Status;
  status_label: string;
  is_active: boolean;
  is_trashed: boolean;
  deleted_via_company: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  permissions: ProductPermissions;
  formattedPrice: string;
  formattedCreatedAt: string;
  companyName: string;
};

export type ProductPayload = {
  company_id: number | '';
  name: string;
  description: string;
  price: string;
  internal_code: string;
};
