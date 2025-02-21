package com.chat.chatapp.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.chat.chatapp.entity.Room;
import com.chat.chatapp.repository.RoomRepository;

@Service
public class RoomService {

	@Autowired
	private RoomRepository roomRepository;

	public Room createRoom(String roomId) {
		Room room = new Room();
		room.setRoomId(roomId);
		return roomRepository.save(room);
	}

	public Room getRoomById(String roomId) {
		return roomRepository.findByRoomId(roomId);
		
	}

	public void saveRoom(Room room) {
		roomRepository.save(room);
	}
	
}
