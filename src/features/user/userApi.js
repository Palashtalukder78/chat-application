import { apiSlice } from "../api/apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (email) =>
        `/users?email-like=${email}`,
    }),
  }),
});

export const { useGetUserQuery } = userApi;
