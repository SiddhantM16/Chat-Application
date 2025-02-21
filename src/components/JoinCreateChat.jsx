import { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { joinRoom, roomService } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [roomDetail, setRoomDetail] = useState({
    roomId: "",
    userName: "",
  });

  const {
    // roomId,
    // currentUser,
    // connected,
    setConnected,
    setCurrentUser,
    setRoomId,
  } = useChatContext();

  const navigate = useNavigate();

  const handleFormInputChange = (e) => {
    setRoomDetail({
      ...roomDetail,
      [e.target.name]: e.target.value,
    });
  };

  const formValidate = () => {
    if (roomDetail.userName == "" || roomDetail.roomId == "") {
      toast.error("Please insert valid inputs");
      return false;
    }
    return true;
  };

  const handleJoinChat = async () => {
    if (formValidate()) {
      try {
        const room = await joinRoom(roomDetail.roomId);
        // console.log(room);
        toast.success("Room joined successfully");
        setCurrentUser(roomDetail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        // console.log(error);
        if (error.status == 404) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
      }
    }
  };

  const handleCreateRoom = async () => {
    if (formValidate()) {
      try {
        const response = await roomService(roomDetail.roomId);
        // console.log(response);
        toast.success("Room is created successfully");
        setCurrentUser(roomDetail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        // console.log(error);
        if (error.status == 502) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in creating room");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-10 dark:border-gray-700 border dark:bg-gray-900 w-full max-w-md rounded-2xl shadow flex flex-col gap-7">
        <div>
          <img src={chatIcon} className="w-20 m-auto" />
        </div>
        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room...
        </h1>
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            value={roomDetail.userName}
            onChange={handleFormInputChange}
            name="userName"
            placeholder="Enter your username"
            className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-600 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Room id Div */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Room ID / New Room ID
          </label>
          <input
            value={roomDetail.roomId}
            onChange={handleFormInputChange}
            type="text"
            name="roomId"
            placeholder="Enter the room id"
            className="w-full dark:bg-gray-600 px-4 py-2 dark:border-gray-600 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button Div */}
        <div className="flex items-center justify-center gap-3">
          <button
            className="p-3 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full "
            onClick={handleJoinChat}
          >
            Join Room
          </button>
          <button
            className="p-3 dark:bg-green-600 hover:dark:bg-green-800 rounded-full"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
