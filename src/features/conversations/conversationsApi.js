import { apiSlice } from "../api/apiSlice";

const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants-like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversations?participants-like=${userEmail}&participants-like=${participantEmail}&&participants-like=${participantEmail}&participants-like=${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: (data) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
    }),
    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationsApi;
