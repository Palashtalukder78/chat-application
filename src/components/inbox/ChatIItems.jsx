import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../../features/conversations/conversationsApi";
import ChatItem from "./ChatItem";
import Error from "../ui/Error";
import moment from "moment";
import getParticipantinfo from "../../utils/getParticipantinfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth);
  const { email } = user || {};
  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useGetConversationsQuery(email) || {};

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
    content = conversations?.map((conversation) => {
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
    });
  return <ul>{content}</ul>;
}
