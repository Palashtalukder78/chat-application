import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedOut } from "../auth/authSlice";

const baseQuery =  fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: async (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  })

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) =>{
    let result = await baseQuery(args, api, extraOptions);
    if(result?.error?.status === 401){
      api.dispatch(userLoggedOut())
      localStorage.clear();
    }
    return result;
  },
  tagTypes: [],
  endpoints: (builder) => ({}),
});
