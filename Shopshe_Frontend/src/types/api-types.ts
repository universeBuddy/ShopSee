import { Product, User } from "./types";

export type CustomError = {
  staus: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponse = {
  success: boolean;
  product: Product[];
};
export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};


export type SearchProductResponse = {
  success: boolean;
  product: Product[],
  totalPage:number;
};
export type SearchProductRequest = {
  price: number,
  page: number,
  category: string,
  search: string,
  sort: string,
};
export type NewProuctRequest = {
  id: string,
 formData:FormData;
};