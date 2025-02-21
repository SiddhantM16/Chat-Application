package com.chat.chatapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.chat.chatapp.entity.Message;
import com.chat.chatapp.entity.Room;
import com.chat.chatapp.payload.MessageRequest;
import com.chat.chatapp.service.ChatService;
import com.chat.chatapp.service.RoomService;

@RestController
@CrossOrigin("http://localhost:5173")
public class ChatController {
	
	@Autowired
	private RoomService roomService;
	
	@Autowired
	private ChatService chatService;
	
	@MessageMapping("/sendMessage/{roomId}")
	@SendTo("/topic/room/{roomId}")
	public Message sendMessage(@DestinationVariable String roomId , @RequestBody MessageRequest request) {
		
		Room room = roomService.getRoomById(request.getRoomId());
		
		Message message = chatService.sendMessage(request);
		
		if(room != null) {
			room.getMessages().add(message);
			roomService.saveRoom(room);
		}else {
			throw new RuntimeException("Room not found");
		}
		
		return message;
		
		
		

		
	}

}
