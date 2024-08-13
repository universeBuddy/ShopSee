import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoriesResponse, MessageResponse, NewProuctRequest, SearchProductRequest, SearchProductResponse } from "../../types/api-types";


export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
    }),
    allProduct: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => `categories`,
    }),

    searchProduct: builder.query<SearchProductResponse, SearchProductRequest>({
      query: ({price,search,sort,page,category}) => {
          

        let base = `all?search=${search}&page=${page}`

        if(price) base  +=`&price=${price}`
        if(sort) base  +=`&sort=${sort}`
        if(price) base  +=`&category=${category}`
     

       return base;

      },
    }), 

    newProduct: builder.mutation<MessageResponse, NewProuctRequest>({
      query: ({formData,id}) => ({
       

        url:`new?id=${id}`,
        method:"POST",
        body:formData

      })
    }),
  }),
});
export const {
  useLatestProductsQuery,
  useAllProductQuery,
  useCategoriesQuery,
  useSearchProductQuery,
  useNewProductMutation

} = productAPI;
