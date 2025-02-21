package com.chat.chatapp.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chat.chatapp.entity.Message;
import com.chat.chatapp.entity.Room;
import com.chat.chatapp.service.RoomService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping(path = "/api/v1")
public class RoomController {

	@Autowired
	private RoomService roomService;

	@GetMapping(path = "/room/{roomId}")
	public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
		Room room = roomService.getRoomById(roomId);
		if (room == null) {
			return new ResponseEntity<>("Room not found",HttpStatus.NOT_FOUND);
		} else {
			return ResponseEntity.ok(room);
		}
	}

	@PostMapping(path = "/rooms")
	public ResponseEntity<?> createRoom(@RequestBody String roomId) {

		Room room = roomService.getRoomById(roomId);
		if (room != null) {
			return new ResponseEntity<>("Room already exists",HttpStatus.BAD_GATEWAY);
		} else {
			Room createdRoom = roomService.createRoom(roomId);
			return new ResponseEntity<>(createdRoom,HttpStatus.CREATED);
		}
	}

	@GetMapping(path = "/{roomId}/messages")
	public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId,
			@RequestParam(defaultValue = "0", required = false) int page,
			@RequestParam(defaultValue = "20", required = false) int size) {

		Room room = roomService.getRoomById(roomId);
		if (room == null) {
			ResponseEntity.badRequest().build();
		}

		List<Message> messages = room.getMessages();

		int start = Math.max(0, messages.size() - (page + 1) * size);
		int end = Math.min(messages.size(), start + size);
		List<Message> paginatedMessages = messages.subList(start, end);

		return ResponseEntity.ok(paginatedMessages);
	}

}
