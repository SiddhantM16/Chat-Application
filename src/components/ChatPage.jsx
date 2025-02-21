/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MdAttachFile } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../services/TimeAgo";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  const connectWebSocket = () => {
    const socket = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      setStompClient(client);

      toast.success("Connected");
      client.subscribe(`/topic/room/${roomId}`, (messages) => {
        // console.log(messages);

        const newMessage = JSON.parse(messages.body);
        setMessages((prev) => [...prev, newMessage]);
      });
    });
  };

  useEffect(() => {
    if (connected) {
      connectWebSocket();
    }
  }, [roomId]);

  // Handler for sending messages

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      // console.log(input);
      const message = {
        sender: currentUser,
        content: input,
        roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  const loadMessages = async () => {
    try {
      const message = await getMessages(roomId);
      // console.log(messages);
      setMessages(message);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    if (connected) {
      loadMessages();
    }
  }, []);

  // Automatic scroll down messages in chat

  const scrollBehavior = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    scrollBehavior();
  }, [messages]);

  // Leave Room functionality
  const handleLeaveRoom = () => {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div>
      {/* This is header container */}
      <header className="flex justify-around items-center dark:bg-gray-700 dark:border-gray-700 border fixed w-full py-5">
        {/* Room name container */}
        <div>
          <h1>
            Room: <span>{roomId}</span>
          </h1>
        </div>
        {/* Username container */}
        <div>
          <h1>
            User: <span>{currentUser}</span>
          </h1>
        </div>
        {/* Button leave room */}
        <div>
          <button
            className="bg-red-500 px-3 py-2 rounded-full hover:bg-red-700"
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
        </div>
      </header>

      <main
        ref={chatBoxRef}
        className="py-20 px-5 mb-20 overflow-auto h-screen w-2/3 mx-auto dark:bg-slate-800"
      >
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`my-2 flex flex-row gap-2 items-center ${
                message.sender == currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div>
                <img
                  className="h-6 w-6 "
                  src="https://avatar.iran.liara.run/public"
                />
              </div>
              <div
                className={` ${
                  message.sender == currentUser
                    ? "bg-purple-600"
                    : "bg-slate-600"
                } p-2 rounded-xl max-w-xs flex flex-col gap-y-0.5`}
              >
                <p className="text-sm font-bold">{message.sender}</p>
                <p>{message.content}</p>
                <p className="text-xs text-gray-300">
                  {timeAgo(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </main>

      {/* This is chat container */}

      {/* This is input text container */}
      <div className="bottom-4 h-16 fixed w-full">
        <div className="h-full w-1/2 mx-auto dark:bg-gray-900 rounded-full flex justify-between items-center px-5 gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Type your message"
            className="dark:border-gray-800 dark:bg-gray-900 py-2 rounded w-full focus:outline-none "
          />
          <div className="flex items-center gap-3">
            <button className="bg-purple-600 rounded-full h-10 w-10 justify-items-center">
              <MdAttachFile size={20} />
            </button>
            <button
              className="bg-green-600 rounded-full h-10 w-12 justify-items-center"
              onClick={sendMessage}
            >
              <IoIosSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
