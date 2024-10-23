import { io } from "socket.io-client";
import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) =>
        `messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=${
          import.meta.env.VITE_CONVERSATION_PER_PAGE
        }`,
      //Socketing
      //Socketing
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // Create socket
        const socket = io("https://chat-app-server-sie3.onrender.com/", {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttempts: 10,
          transports: ["websocket"],
          upgrade: false,
          rejectUnauthorized: false,
        });

        try {
          await cacheDataLoaded;

          // Listen for incoming messages
          socket.on("message", (data) => {
            updateCachedData((draft) => {
              const message = draft.find(
                (m) => m.conversationId == data.data.conversationId
              );
              if (message?.id) {
                draft.push(data.data);
              }
            });
          });
        } catch (error) {} 
        finally {
          // Cleanup: remove the listener and close the socket
          await cacheEntryRemoved;
          socket.off("message"); // Remove the listener
          socket.close(); // Ensure the socket is closed
        }
      },
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
