import { useEffect, useState } from "react";
import isValidEmail from "../../utils/isValidEmail";
import { useGetUserQuery } from "../../features/user/userApi";
import Error from "../ui/Error";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationsApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversations/conversationsApi";

export default function Modal({ open, control }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [userCheck, setUserCheck] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [conversation, setConversation] = useState(undefined);
  const dispatch = useDispatch();

  const { user: loggedInUSer } = useSelector((state) => state.auth);
  const { email: myEmail } = loggedInUSer || {};
  const { data: participant } = useGetUserQuery(to, {
    skip: !userCheck,
  });

  useEffect(() => {
    if (participant?.length > 0 && participant[0]?.email !== myEmail) {
      //code will be here
      dispatch(
        conversationsApi.endpoints.getConversation.initiate({
          userEmail: myEmail,
          participantEmail: to,
        })
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        })
        .catch((err) => {
          setResponseError(err?.data);
        });
    }
  }, [participant, myEmail, to, dispatch]);

  const [addConversation, { isSuccess: successAddConversation }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: successEditConversation }] =
    useEditConversationMutation();

  //finding valid 'to' -start
  const debounceHandler = (fn, delay) => {
    let timeOutId;
    return (...args) => {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const doSearch = (value) => {
    const validEmail = isValidEmail(value);
    if (validEmail) {
      setUserCheck(true);
      setTo(value);
    }
  };
  const handleSearch = debounceHandler(doSearch, 500);
  //finding valid 'to' -end

  const handleSubmit = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      //edit conversation
      editConversation({
        id: conversation[0]?.id,
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant[0].email}`,
          users: [loggedInUSer, participant[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    } else if (conversation?.length === 0) {
      //add Conversation
      addConversation({
        sender: myEmail,
        data: {
          participants: `${myEmail}-${participant[0].email}`,
          users: [loggedInUSer, participant[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
  };
  useEffect(() => {
    if (successAddConversation || successEditConversation) {
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successAddConversation, successEditConversation]);
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  onChange={(e) => handleSearch(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Send Message
              </button>
            </div>

            {participant?.length === 0 && <Error message="User Not found" />}
            {participant?.length > 0 && participant[0]?.email === myEmail && (
              <Error message="You can not message yourself!" />
            )}
          </form>
        </div>
      </>
    )
  );
}
