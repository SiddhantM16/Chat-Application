/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, useState } from "react";
import { createContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [connected, setConnected] = useState(false);
  return (
    <ChatContext.Provider
      value={{
        roomId,
        currentUser,
        connected,
        setCurrentUser,
        setRoomId,
        setConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);
export default useChatContext;
