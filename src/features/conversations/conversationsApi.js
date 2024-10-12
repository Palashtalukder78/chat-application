/* eslint-disable no-unused-vars */
import { io } from "socket.io-client";
import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
      //Socketing
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        //Create socket
        const socket = io("http://localhost:9000", {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttempts: 10,
          transports: ["websocket"],
          again: false,
          upgrade: false,
          rejectUnauthorized: false,
        });
        try {
          await cacheDataLoaded;
          socket.on("conversation", (data) => {
            updateCachedData((draft) => {
              const conversation = draft.find((c) => c.id == data?.data?.id);
              if (conversation?.id) {
                conversation.message = data.data.message;
                conversation.timestamp = data.data.timestamp;
              }
            });
          });
        } catch (error) {}
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const users = arg?.data?.users;
            const senderInfo = users?.find(
              (user) => user?.email === arg?.sender
            );
            const recieverInfo = users?.find(
              (user) => user?.email !== arg?.sender
            );
            // Cache update after successful query fulfillment
            dispatch(
              apiSlice.util.updateQueryData(
                "getConversations",
                arg.sender,
                (draft) => {
                  draft.push(conversation.data); // Update cache with the new conversation
                }
              )
            );
            // Cache update after successful query fulfillment
            dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderInfo,
                receiver: recieverInfo,
                message: arg?.data?.message,
                timestamp: arg?.data?.timestamp,
              })
            );
          }
        } catch (error) {
          // patchResult2.undo();
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, sender, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        //Optimistake update start
        const patchResult1 = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              const draftConversation = draft.find((c) => c.id == arg.id);
              draftConversation.message = arg.data.message;
              draftConversation.timestamp = arg.data.timeStamp;
            }
          )
        );
        //Optimistake update end

        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const users = arg?.data?.users;
            const senderInfo = users?.find(
              (user) => user?.email === arg?.sender
            );
            const recieverInfo = users?.find(
              (user) => user?.email !== arg?.sender
            );

            const res = await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderInfo,
                receiver: recieverInfo,
                message: arg?.data?.message,
                timestamp: arg?.data?.timestamp,
              })
            ).unwrap();
            //Presimitically cache update start
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );
            //Presimitically cache update end
          }
        } catch (error) {
          patchResult1.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationsApi;
