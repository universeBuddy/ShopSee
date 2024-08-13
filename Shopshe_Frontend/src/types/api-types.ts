import { Producut, User } from "./types";

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
  product: Producut[];
};
export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};


export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};
