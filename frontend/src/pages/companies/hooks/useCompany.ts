import { createContext, useContext } from 'react';
import { Company } from 'types/company';
import { CompanyActionType } from '../actions/companyActions';

type CompanyContextValue = {
  handleSelectAction(company: Company, action: CompanyActionType): void;
};

const CompanyContext = createContext<CompanyContextValue>({} as CompanyContextValue);

export const CompanyProvider = CompanyContext.Provider;

export function useCompany(): CompanyContextValue {
  return useContext(CompanyContext);
}
