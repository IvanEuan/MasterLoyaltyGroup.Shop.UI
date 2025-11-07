import {StoreProduct} from './store-product.model';

export interface Product {
  id: number;
  code: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  createdAt: Date;
  stores: StoreProduct[];
}
