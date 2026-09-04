import { Status } from './status';

/** O que a regra de negócio permite fazer com o registro, calculado no servidor. */
export type CompanyPermissions = {
  update: boolean;
  inactivate: boolean;
  reactivate: boolean;
  delete: boolean;
  restore: boolean;
  force_delete: boolean;
};

export type Company = {
  id: number;
  name: string;
  cnpj: string;
  cnpj_formatted: string;
  email: string;
  phone: string;
  status: Status;
  status_label: string;
  is_active: boolean;
  is_trashed: boolean;
  products_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  permissions: CompanyPermissions;
  formattedPhone: string;
  formattedCreatedAt: string;
};

/** Empresa apta a receber vínculo de produto. */
export type SelectableCompany = {
  id: number;
  name: string;
  cnpj_formatted: string;
};

export type CompanyPayload = {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
};
