// import Blank from "./Blank";
import { useParams } from "react-router-dom";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useGetMessagesQuery } from "../../../features/messages/messagesApi";
import Error from "../../ui/Error";

export default function ChatBody() {
  const { id } = useParams();
  const { data: messages, isLoading, isError, error } = useGetMessagesQuery(id);

  let content = null;
  if (isLoading) content = <div>Loading...</div>;
  if (!isLoading && isError)
    content = (
      <div>
        <Error message={error} />
      </div>
    );
  if (!isLoading && !isError && messages?.length === 0)
    content = <div>Chat are not Available!!</div>;
  if (!isLoading && !isError && messages?.length > 0)
    content = (
      <>
        <ChatHead message={messages[0]} />
        <Messages messages={messages} />
        <Options />
      </>
    );
  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">{content}</div>
    </div>
  );
}
