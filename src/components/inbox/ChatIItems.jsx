
import { useDispatch, useSelector } from "react-redux";
import { conversationsApi, useGetConversationsQuery } from "../../features/conversations/conversationsApi";
import ChatItem from "./ChatItem";
import Error from "../ui/Error";
import moment from "moment";
import getParticipantinfo from "../../utils/getParticipantinfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth);

  const { email } = user || {};
  const { data, isLoading, isError, error } =
    useGetConversationsQuery(email) || {};

  const { data: conversations, totalCount } = data || {};
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchMore = () => {
    setPage((prevPage)=> prevPage + 1)
  };
  const dispatch = useDispatch();

  useEffect(()=>{
    if(totalCount > 0){
      const more = Math.ceil(totalCount / Number(import.meta.env.VITE_CONVERSATION_PER_PAGE))> page;
      setHasMore(more)
    }
  },[totalCount, page]);

  useEffect(()=>{
    if(page> 1){
      dispatch(conversationsApi.endpoints.getMoreConversations.initiate({email, page}))
    }
  },[page, dispatch, email])

  let content = null;

  if (isLoading)
    content = (
      <li>
        <div>Loading...</div>
      </li>
    );
  if (!isLoading && isError)
    content = (
      <li>
        <Error message={error} />
      </li>
    );
  if (!isLoading && !isError && conversations?.length === 0)
    content = (
      <li>
        <Error message="No conversation Found!!!" />
      </li>
    );
  if (!isLoading && !isError && conversations?.length > 0)
    content = (
      <InfiniteScroll
        dataLength={conversations.length} //This is important field to render the next data
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 129}
      >
        {conversations?.map((conversation) => {
          const { id, message, timestamp, users } = conversation;
          const participant = getParticipantinfo(users, email);
          const { email: participantEmail, name } = participant || {};
          return (
            <li key={id}>
              <Link to={`/inbox/${id}`}>
                <ChatItem
                  avatar={gravatarUrl(participantEmail, { size: 80 })}
                  name={name}
                  lastMessage={message}
                  lastTime={moment(timestamp).fromNow()}
                />
              </Link>
            </li>
          );
        })}
      </InfiniteScroll>
    );

  return <ul>{content}</ul>;
}
