import { apiSlice } from "../api/apiSlice";

const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `/messages?conversationId-like=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
    }),
  }),
});

export const {useGetMessagesQuery} = messagesApi;
