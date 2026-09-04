import { createContext, useContext } from 'react';
import { Product } from 'types/product';
import { ProductActionType } from '../actions/productActions';

type ProductContextValue = {
  handleSelectAction(product: Product, action: ProductActionType): void;
};

const ProductContext = createContext<ProductContextValue>({} as ProductContextValue);

export const ProductProvider = ProductContext.Provider;

export function useProduct(): ProductContextValue {
  return useContext(ProductContext);
}
