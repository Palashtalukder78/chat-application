import gravatarUrl from "gravatar-url";
import { useSelector } from "react-redux";

export default function ChatHead({ message }) {
    const {sender, receiver} = message || {};
    const {user} = useSelector(state=> state.auth);
    const {email} = user || {};
    const participantEmail =
      sender?.email === email ? receiver.email : sender.email;
    const participantName =
      sender?.email === email ? receiver.name : sender.name;
    return (
      <div className="relative flex items-center p-3 border-b border-gray-300">
        <img
          className="object-cover w-10 h-10 rounded-full"
          src={gravatarUrl(participantEmail, { size: 80 })}
          alt={participantName}
        />
        <span className="block ml-2 font-bold text-gray-600">
          {participantName}
        </span>
      </div>
    );
}
