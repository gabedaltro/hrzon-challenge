import { TableTemplate } from 'types/tableTemplate';

export const companiesTableTemplate: TableTemplate[] = [
  {
    id: 'name',
    description: 'NOME',
    originalId: 'name',
    width: 240,
  },
  {
    id: 'cnpj_formatted',
    description: 'CNPJ',
    originalId: 'cnpj',
    width: 170,
  },
  {
    id: 'email',
    description: 'E-MAIL',
    originalId: 'email',
    width: 200,
  },
  {
    id: 'formattedPhone',
    description: 'TELEFONE',
    originalId: 'phone',
    width: 150,
  },
  {
    id: 'products_count',
    description: 'PRODUTOS',
    originalId: 'products_count',
    width: 110,
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
    description: 'CRIADA EM',
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
