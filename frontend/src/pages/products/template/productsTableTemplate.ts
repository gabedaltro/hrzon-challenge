import { TableTemplate } from 'types/tableTemplate';

export const productsTableTemplate: TableTemplate[] = [
  {
    id: 'name',
    description: 'NOME',
    originalId: 'name',
    width: 240,
  },
  {
    id: 'internal_code',
    description: 'CÓDIGO INTERNO',
    originalId: 'internal_code',
    width: 160,
  },
  {
    id: 'companyName',
    description: 'EMPRESA',
    originalId: 'company',
    width: 220,
  },
  {
    id: 'formattedPrice',
    description: 'PREÇO',
    originalId: 'price',
    width: 130,
    dataType: 'number',
  },
  {
    id: 'situation',
    description: 'SITUAÇÃO',
    originalId: 'status',
    width: 180,
  },
  {
    id: 'formattedCreatedAt',
    description: 'CRIADO EM',
    originalId: 'created_at',
    width: 150,
  },
  {
    id: 'actions',
    description: 'AÇÕES',
    originalId: 'actions',
    width: 90,
    notSortable: true,
  },
];
